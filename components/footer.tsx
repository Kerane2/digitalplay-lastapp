import Link from 'next/link';
import { Mail, Phone, MapPin, Gamepad2 } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background mt-auto">
      <div className="container mx-auto py-16 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Column */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary via-accent to-primary">
                <Gamepad2 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-primary">
                Digital Play
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Votre boutique gaming de confiance pour recharges, abonnements et accessoires premium.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" />
              <span className="font-medium">🇬🇦 Libreville, Gabon</span>
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="font-bold text-base mb-4">Navigation</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-muted-foreground hover:text-primary transition-colors">
                  Catégories
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-muted-foreground hover:text-primary transition-colors">
                  Produits
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-primary transition-colors">
                  Panier
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories Column */}
          <div>
            <h4 className="font-bold text-base mb-4">Catégories</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/categories/recharges-jeux" className="text-muted-foreground hover:text-primary transition-colors">
                  Recharges Jeux
                </Link>
              </li>
              <li>
                <Link href="/categories/abonnements" className="text-muted-foreground hover:text-primary transition-colors">
                  Abonnements
                </Link>
              </li>
              <li>
                <Link href="/categories/cartes-cadeaux" className="text-muted-foreground hover:text-primary transition-colors">
                  Cartes Cadeaux
                </Link>
              </li>
              <li>
                <Link href="/categories/accessoires" className="text-muted-foreground hover:text-primary transition-colors">
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="font-bold text-base mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-muted-foreground">
                <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="tel:+241074696109" className="hover:text-primary transition-colors">
                  +241 07 46 96 109
                </a>
              </li>
              <li className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <a href="mailto:contact@digitalplay.ga" className="hover:text-primary transition-colors break-all">
                  contact@digitalplay.ga
                </a>
              </li>
              <li className="mt-4">
                <a 
                  href="https://wa.me/241074696109" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  Commander sur WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} <span className="font-semibold text-primary">Digital Play</span>. Tous droits réservés.
            {' • '}
            <span className="inline-flex items-center gap-1">
              Fièrement créé au <span className="font-semibold">🇬🇦 Gabon</span>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
