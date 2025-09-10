# RippleFind Deployment & Maintenance Rules

## 🚀 Live Site
- **Production URL**: https://ripplefind-production.netlify.app
- **Netlify Project ID**: `b9aa0cf4-4e4c-4fcf-a116-0b60c598957f`
- **Admin Panel**: https://app.netlify.com/projects/ripplefind-production

## ⚠️ Critical Dependencies
- **Next.js Version**: 14.2.5+ (NEVER downgrade to 13.x - has telemetry bugs)
- **Node Version**: 18 (configured in netlify.toml)
- **React Version**: 18.3.1+

## 📁 Key Files & Configuration
- **netlify.toml**: Keep `@netlify/plugin-nextjs` plugin enabled
- **Logo Asset**: `/public/ripplefindlogo.png` - no fallbacks needed
- **Build Command**: `npm run build`
- **Publish Directory**: `.next`

## 🎨 Component Rules
- **Floating Particles**: Enable with `particleOptions={{ enabled: true }}` on WavesBackground in TagSection
- **Logo Rendering**: Use plain `<img>` in main nav (app/page.tsx) to avoid Next/Image timing issues
- **Fade Labels**: Privacy & footer labels fade on scroll (opacity-90 → opacity-0 after 10px)

## 🔄 Deployment Process
1. **Local Test**: Always run `npm run build` locally first
2. **Deploy**: Use `npx netlify deploy --prod` for production
3. **Troubleshooting**: If telemetry errors occur, check Next.js version
4. **Build Flag**: Never use `--build` flag - let netlify.toml handle it

## 🔍 SEO & Monitoring
- **Search Engines**: Remove `X-Robots-Tag: noindex, nofollow` from netlify.toml when ready for public
- **Dynamic Routes**: Format `/inviter-name/invited-name` works correctly
- **Health Check**: `/api/health` endpoint available for monitoring

## 🚨 Never Do This
- Downgrade Next.js below 14.x
- Remove the Netlify Next.js plugin
- Use fallback logic for the logo (causes broken images)
- Deploy without testing build locally first

## 🔧 Quick Fixes
- **Broken Logo**: Check `/public/ripplefindlogo.png` exists and use plain `<img>` tag
- **Deploy Fails**: Upgrade Next.js to latest 14.x version
- **Missing Particles**: Ensure `particleOptions={{ enabled: true }}` in TagSection
- **Build Errors**: Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
