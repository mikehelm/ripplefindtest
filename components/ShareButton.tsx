'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Share2, Copy, Mail, MessageCircle, Check, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface ShareButtonProps {
  referralCode: string;
  userName: string;
}

export function ShareButton({ referralCode, userName }: ShareButtonProps) {
  const [copied, setCopied] = useState(false);
  
  // Construct the referral link
  const referralLink = `${window?.location?.origin || 'https://ripplefind.com'}?ref=${referralCode}`;
  
  // Share message template
  const shareMessage = `You're just 5 people away from the next billion-dollar founder. ${userName} invited you to start your Ripple and own a piece of what's coming. Join me: ${referralLink}`;
  
  // Shortened message for social media
  const shortMessage = `🌊 Start your Ripple and own a piece of the next billion-dollar startup! ${referralLink}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      toast.success('Referral link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join my Ripple network!');
    const body = encodeURIComponent(shareMessage);
    window.open(`mailto:?subject=${subject}&body=${body}`, '_blank');
  };

  const shareViaTwitter = () => {
    const text = encodeURIComponent(shortMessage);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const shareViaWhatsApp = () => {
    const text = encodeURIComponent(shareMessage);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  const shareViaLinkedIn = () => {
    const url = encodeURIComponent(referralLink);
    const title = encodeURIComponent('Join my Ripple network!');
    const summary = encodeURIComponent('You\'re just 5 people away from the next billion-dollar founder.');
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&title=${title}&summary=${summary}`, '_blank');
  };

  const shareNatively = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join my Ripple network!',
          text: shareMessage,
          url: referralLink,
        });
      } catch (err) {
      }
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* Quick Copy Button */}
      <Button
        variant="outline"
        size="sm"
        onClick={copyToClipboard}
        className="flex items-center space-x-2"
      >
        {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
      </Button>

      {/* Share Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="btn-ripple bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
            <Share2 className="w-4 h-4 mr-2" />
            Share Ripple
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={copyToClipboard} className="cursor-pointer">
            <Copy className="w-4 h-4 mr-3" />
            Copy Link
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={shareViaEmail} className="cursor-pointer">
            <Mail className="w-4 h-4 mr-3" />
            Share via Email
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={shareViaWhatsApp} className="cursor-pointer">
            <MessageCircle className="w-4 h-4 mr-3" />
            Share on WhatsApp
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={shareViaTwitter} className="cursor-pointer">
            <ExternalLink className="w-4 h-4 mr-3" />
            Share on X (Twitter)
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={shareViaLinkedIn} className="cursor-pointer">
            <ExternalLink className="w-4 h-4 mr-3" />
            Share on LinkedIn
          </DropdownMenuItem>

          {/* Native Share (Mobile) */}
          {typeof navigator !== 'undefined' && typeof navigator.share === 'function' && (
            <DropdownMenuItem onClick={shareNatively} className="cursor-pointer">
              <Share2 className="w-4 h-4 mr-3" />
              More Options
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}