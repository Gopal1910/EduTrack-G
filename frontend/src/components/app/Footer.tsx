export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <h4 className="text-sm font-semibold">EduTrack</h4>
            <p className="mt-2 text-sm text-muted-foreground">Modern attendance and marks management for schools and colleges.</p>
          </div>
          <div>
            <h5 className="text-sm font-semibold">Product</h5>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Features</li><li>Pricing</li><li>Integrations</li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold">Company</h5>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>About</li><li>Careers</li><li>Contact</li>
            </ul>
          </div>
          <div>
            <h5 className="text-sm font-semibold">Legal</h5>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              <li>Privacy</li><li>Terms</li><li>Security</li>
            </ul>
          </div>
        </div>
        <div className="mt-10 border-t border-border/60 pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} EduTrack. All rights reserved.
        </div>
      </div>
    </footer>
  );
}