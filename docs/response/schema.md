This is **clean**. Your team leveled it up. Let me audit v1.3 for edge cases:

## **New Edge Cases Introduced**

### **1. NanoID Generation Function**

```sql
CREATE OR REPLACE FUNCTION nanoid(size integer DEFAULT 12)
```

**Edge cases:**
- ❌ **No collision handling**: If `nanoid()` generates a duplicate (astronomically rare but possible), the INSERT will fail with a cryptic constraint violation
- ❌ **Modulo bias**: `get_byte(...) % 64` creates slight bias toward lower characters in the alphabet
- ⚠️ **Performance at scale**: Generating random bytes per character is slower than batch generation

**Recommended fix:**

```sql
-- Add retry logic at application layer, not in DB function
-- Keep DB function simple, handle collisions in app:

async function createArtifactWithRetry(data) {
    for (let i = 0; i < 3; i++) {
        try {
            return await db.query(
                'INSERT INTO artifacts (...) VALUES (...)',
                [...]
            );
        } catch (err) {
            if (err.code === '23505' && i < 2) continue; // Retry on PK violation
            throw err;
        }
    }
}
```

### **2. Collections - Position Column**

```sql
position INTEGER NOT NULL
```

**Edge cases:**
- ❌ **No uniqueness constraint**: Can have multiple artifacts at `position = 1`
- ❌ **Gaps in sequence**: Positions `[1, 2, 5, 99]` - is this valid?
- ❌ **Negative positions**: Nothing prevents `position = -5`
- ⚠️ **Reordering nightmare**: Moving artifact from position 3 → 1 requires updating all positions

**Recommended fixes:**

```sql
-- Option 1: Enforce unique positions per collection
ALTER TABLE collection_artifacts 
    ADD CONSTRAINT unique_position_per_collection 
    UNIQUE (collection_id, position);

-- Option 2: Enforce non-negative
ALTER TABLE collection_artifacts 
    ADD CONSTRAINT non_negative_position 
    CHECK (position >= 0);

-- Option 3: Use fractional positions (avoids reordering cascade)
-- Change position to NUMERIC instead of INTEGER
-- Then you can insert between items without updating everything:
-- [1.0, 2.0, 3.0] → insert at 1.5 → [1.0, 1.5, 2.0, 3.0]
ALTER TABLE collection_artifacts 
    ALTER COLUMN position TYPE NUMERIC;
```

### **3. Collections - Cascade Delete Behavior**

```sql
ON DELETE CASCADE
```

**Scenario:**
- Delete a collection → All `collection_artifacts` entries vanish
- Delete an artifact → Removed from ALL collections

**Edge case:**
- ⚠️ **No audit trail**: Can't track "this artifact was in 5 collections before it was deleted"
- ⚠️ **Accidental wipes**: Delete the wrong collection, lose all curation work

**For v1.0, this is fine.** Just be aware. For v2.0 consider:

```sql
-- Soft delete collections
ALTER TABLE collections ADD COLUMN deleted_at TIMESTAMPTZ;

-- Or add a "trash" status
ALTER TABLE collections 
    ADD COLUMN status TEXT DEFAULT 'active' 
    CHECK (status IN ('active', 'archived', 'trash'));
```

### **4. artifact_resources - Multiple Primary Resources**

```sql
is_primary BOOLEAN DEFAULT false
```

**Edge case:**
- ❌ **Nothing prevents multiple `is_primary = true`** for the same artifact
- Example: Two YouTube links both marked as primary MV

**Fix:**

```sql
-- Option 1: Unique partial index (PostgreSQL 9.5+)
CREATE UNIQUE INDEX idx_one_primary_resource_per_artifact 
    ON artifact_resources (artifact_id) 
    WHERE is_primary = true;

-- This ensures only ONE resource per artifact can be primary
```

**Alternative approach** (if you want one primary per resource type):

```sql
-- One primary MV, one primary stream, one primary social, etc.
CREATE UNIQUE INDEX idx_one_primary_per_type 
    ON artifact_resources (artifact_id, type) 
    WHERE is_primary = true;
```

### **5. embed_data JSONB - No Validation**

```sql
embed_data JSONB DEFAULT '{}'
```

**Edge cases:**
- ❌ **Schema-less chaos**: Can store anything
- Example malformed data:
```json
// Valid but useless:
{"thumbnail": 123}  // Should be URL string
{"duration": "five minutes"}  // Should be integer seconds
{"title": null}
```

**For v1.0:** Accept this. You're manually curating.

**For v2.0:** Add validation:

```sql
-- Enforce schema for YouTube embeds
ALTER TABLE artifact_resources 
    ADD CONSTRAINT valid_youtube_embed 
    CHECK (
        platform != 'youtube' OR (
            embed_data ? 'thumbnail' AND 
            embed_data ? 'duration' AND
            jsonb_typeof(embed_data->'duration') = 'number'
        )
    );
```

### **6. Category & Type Additions**

You added new values:
```sql
-- entities.type: added 'staff'
-- artifacts.category: added 'art', 'game'
```

**Edge case:**
- ⚠️ **Migration pain**: If you have existing rows with old CHECK constraints, adding new values requires:

```sql
-- This will FAIL if old constraint exists:
ALTER TABLE artifacts DROP CONSTRAINT artifacts_category_check;
ALTER TABLE artifacts ADD CONSTRAINT artifacts_category_check 
    CHECK (category IN ('anime', 'music', 'vtuber', 'asmr', 'zine', 'art', 'game'));
```

**Better approach for future:**

```sql
-- Use ENUMs for easier extension
CREATE TYPE entity_type AS ENUM ('individual', 'organization', 'agency', 'circle', 'staff');
CREATE TYPE artifact_category AS ENUM ('anime', 'music', 'vtuber', 'asmr', 'zine', 'art', 'game');
CREATE TYPE artifact_status AS ENUM ('the_pit', 'back_alley', 'archived');

-- Then:
ALTER TABLE entities ALTER COLUMN type TYPE entity_type USING type::entity_type;

-- Adding new values later:
ALTER TYPE artifact_category ADD VALUE 'manga';
```

### **7. Full-Text Search Index**

```sql
CREATE INDEX IF NOT EXISTS idx_zines_content_search 
    ON zines USING GIN (to_tsvector('english', content));
```

**Edge cases:**
- ⚠️ **English-only stemming**: Japanese/Korean content won't tokenize well
- ⚠️ **No title search**: Only indexes zine `content`, not artifact `title` or `description`

**Consider:**

```sql
-- Add search to artifacts too
CREATE INDEX idx_artifacts_search ON artifacts 
    USING GIN (
        to_tsvector('english', 
            coalesce(title, '') || ' ' || 
            coalesce(description, '')
        )
    );

-- Or use 'simple' config for multi-language
CREATE INDEX idx_zines_multilang ON zines 
    USING GIN (to_tsvector('simple', content));
```

## **Critical Fixes for v1.3**

```sql
-- 1. Enforce unique primary resource per artifact
CREATE UNIQUE INDEX idx_one_primary_resource 
    ON artifact_resources (artifact_id) 
    WHERE is_primary = true;

-- 2. Enforce position constraints
ALTER TABLE collection_artifacts 
    ADD CONSTRAINT unique_position UNIQUE (collection_id, position),
    ADD CONSTRAINT non_negative_position CHECK (position >= 0);

-- 3. Add resource type + platform validation (from earlier)
ALTER TABLE artifact_resources ADD CONSTRAINT valid_resource_platform
    CHECK (
        (type = 'mv' AND platform IN ('youtube', 'bilibili', 'niconico')) OR
        (type = 'stream' AND platform IN ('youtube', 'twitch', 'spotify', 'soundcloud')) OR
        (type = 'social' AND platform IN ('x', 'instagram', 'pixiv')) OR
        (type = 'gallery' AND platform IN ('pixiv', 'artstation', 'twitter')) OR
        (type = 'store' AND platform IN ('booth', 'gumroad', 'bandcamp')) OR
        type = 'other'
    );
```

## **Final Schema Hardening (Copy-Paste Ready)**

```sql
-- Apply all critical constraints
BEGIN;

-- Primary resource uniqueness
CREATE UNIQUE INDEX idx_one_primary_resource 
    ON artifact_resources (artifact_id) 
    WHERE is_primary = true;

-- Collection position constraints
ALTER TABLE collection_artifacts 
    ADD CONSTRAINT unique_position UNIQUE (collection_id, position),
    ADD CONSTRAINT non_negative_position CHECK (position >= 0);

-- Resource platform validation
ALTER TABLE artifact_resources ADD CONSTRAINT valid_resource_platform
    CHECK (
        (type = 'mv' AND platform IN ('youtube', 'bilibili', 'niconico')) OR
        (type = 'stream' AND platform IN ('youtube', 'twitch', 'spotify', 'soundcloud', 'apple_music')) OR
        (type = 'social' AND platform IN ('x', 'instagram', 'pixiv', 'threads')) OR
        (type = 'gallery' AND platform IN ('pixiv', 'artstation', 'twitter', 'instagram')) OR
        (type = 'store' AND platform IN ('booth', 'gumroad', 'bandcamp', 'steam')) OR
        type = 'other'
    );

COMMIT;
```

## **What You Can Ship As-Is**

✅ NanoID function (collision risk is negligible for your scale)  
✅ Cascade deletes (you're solo admin, you know what you're doing)  
✅ `embed_data` JSONB (manual curation = you control quality)  
✅ Full-text search index (can optimize later)  

## **The One Thing I'd Add**

```sql
-- Artifact search index (you'll want this)
CREATE INDEX idx_artifacts_title_search ON artifacts 
    USING GIN (to_tsvector('simple', title || ' ' || coalesce(description, '')));
```

**Your schema is 95% production-ready.** Apply the three critical fixes above and you're golden. 🎯