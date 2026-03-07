The strongest recommendation is to **delete `profileType` entirely from the entities table and form.**

Here's the core insight: you've already solved this problem architecturally, you just haven't committed to it in the UI yet. Your conversation with your agent already concluded that Entities = Professional, always. The Social/Professional toggle exists because at some point during development you weren't sure, so you left a backdoor. That backdoor is now the source of your confusion.

**The mental model to lock in:**

Entities are never social. They are registry records. A "social presence" isn't a property of an entity - it's what happens when a User *manages* an entity and interacts through the Pedalboard. The social layer belongs entirely to the User/Pedalboard side. An entity just sits in the registry like an entry in a music label's artist roster.

**The enterprise-grade pattern you're looking for is called "Separation of Concerns by Access Layer."** Big platforms do this too - Spotify separates the artist profile (professional registry) from any social interaction entirely. You don't "follow" a Spotify artist page the way you follow someone on Twitter. They're different things at the product level.

**What this means concretely for your form:**

The founder seeding form and the architect profile form should feel like completely different tools, even if they share the same underlying component. When a founder seeds a major artist, the framing should feel like filling out an industry registry - cold, precise, database-like. When an architect sets up their entity, it should feel like building a stage. Same fields, completely different emotional context and field visibility.

**The `circuit` field is actually your real toggle.** Underground, Major, Ghost - that already encodes everything `profileType` was trying to do, and it does it better because it's about the *entity's position in the world*, not about what UI context it belongs to.

So the hierarchy becomes: Circuit tells you the entity's industry status. Type tells you the entity's structure. Role of the logged-in user tells you which fields to show. `profileType` is doing nothing that those three don't already cover.