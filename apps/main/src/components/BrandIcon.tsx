
import React from 'react';
import { Icon } from '@iconify/react';
import { getBrandIconUrl } from '@shimokitan/utils';
import { cn } from '@shimokitan/ui';

interface BrandIconProps {
  platform: string;
  className?: string;
  width?: number;
  height?: number;
  fallbackIcon?: string;
}

/**
 * Renders a brand icon from the Shimokitan CDN.
 * Falls back to Iconify (Simple Icons) if the brand is not on the CDN.
 */
export function BrandIcon({ 
  platform, 
  className, 
  width, 
  height, 
  fallbackIcon 
}: BrandIconProps) {
  const cdnUrl = getBrandIconUrl(platform);

  if (cdnUrl) {
    return (
      <img 
        src={cdnUrl} 
        alt={platform} 
        className={cn("object-contain transition-all", className)}
        style={{ width, height }}
        loading="lazy"
      />
    );
  }

  // Fallback to Iconify
  let iconName = fallbackIcon;
  if (!iconName) {
    if (platform === 'official_website') {
      iconName = 'lucide:globe';
    } else {
      iconName = `simple-icons:${platform.toLowerCase().replace(/_/g, '-')}`;
    }
  }
  
  return (
    <Icon 
      icon={iconName} 
      width={width} 
      height={height}
      className={cn("transition-all", className)}
    />
  );
}
