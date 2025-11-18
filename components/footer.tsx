import Link from 'next/link';
import { Facebook, Instagram, Mail, Phone, MapPin, Gamepad2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-gradient-to-b from-background to-muted/30 mt-auto">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary via-accent to-primary shadow-lg">
                <Gamepad2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                Digital Play
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Votre boutique de confiance pour les produits numériques au Gabon. 
              Livraison instantanée garantie.
            </p>
            <div className="flex gap-3">
              <Link 
                href="#" 
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Facebook className="h-5 w-5" />
              </Link>
              <Link 
                href="#" 
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <Instagram className="h-5 w-5" />
              </Link>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Navigation</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  À propos
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Informations</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-muted-foreground hover:text-primary transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-1 h-1 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  Retours & Remboursements
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-foreground">Contactez-nous</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3 text-muted-foreground group">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <a href="tel:+241074696109" className="hover:text-primary transition-colors">
                  +241 074 696 109
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground group">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <a href="mailto:digitalplay241@gmail.com" className="hover:text-primary transition-colors">
                  digitalplay241@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3 text-muted-foreground group">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span>Libreville, Gabon</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} <span className="font-semibold text-primary">Digital Play</span>. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  );
}
