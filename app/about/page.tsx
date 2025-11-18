import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Zap, Headphones, Award } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="border-b border-border bg-muted/30">
          <div className="container py-16">
            <h1 className="font-serif text-5xl font-bold mb-4 text-balance text-center">
              À propos de Digital Play
            </h1>
            <p className="text-lg text-muted-foreground text-center max-w-2xl mx-auto leading-relaxed">
              Votre boutique de confiance pour les produits numériques au Gabon
            </p>
          </div>
        </div>

        <div className="container py-16 space-y-16">
          {/* Mission */}
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-serif text-3xl font-bold mb-6">Notre mission</h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Digital Play est née de la volonté de rendre accessible les produits numériques 
              au Gabon et en Afrique centrale. Nous proposons une large gamme de jeux vidéo, 
              cartes cadeaux et recharges mobiles avec une livraison instantanée et un service 
              client disponible 24/7.
            </p>
          </div>

          {/* Values */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Sécurité</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Paiements sécurisés et codes authentiques garantis
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
                  <Zap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Rapidité</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Livraison instantanée de tous vos codes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
                  <Headphones className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Support</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Service client disponible 24/7
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mx-auto mb-4">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold mb-2">Qualité</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Produits authentiques et garantis
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
