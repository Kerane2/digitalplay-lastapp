'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { mockProducts, Product } from '@/lib/mock-data';
import { formatPrice } from '@/lib/format';
import { addToCart } from '@/lib/cart';
import { useToast } from '@/hooks/use-toast';
import { ShoppingCart, Clock, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductDetailClientProps {
  slug: string;
}

export default function ProductDetailClient({ slug }: ProductDetailClientProps) {
  const { toast } = useToast();
  const [showVideo, setShowVideo] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Universal form states
  const [formData, setFormData] = useState({
    // For streaming subscriptions
    accountEmail: '',
    accountPassword: '',
    duration: '1-month',
    
    // For mobile game top-ups
    userId: '',
    facebookEmail: '',
    facebookPassword: '',
    activisionEmail: '',
    activisionPassword: '',
    quantity: '100',
    
    // For gift cards
    amount: '10',
    recipientEmail: '',
    
    // For accessories
    color: 'default',
    deliveryAddress: '',
    phoneNumber: '',
    
    // Additional notes
    notes: '',
  });

  const product = mockProducts.find((p) => p.slug === slug);

  if (!product) {
    notFound();
  }

  const relatedProducts = mockProducts
    .filter((p) => p.category_id === product.category_id && p.id !== product.id)
    .slice(0, 4);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddToCart = () => {
    // Validation
    if (!validateForm()) {
      toast({
        title: 'Informations manquantes',
        description: 'Veuillez remplir tous les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    const productWithOptions = {
      ...product,
      selectedOptions: formData,
    };
    
    addToCart(productWithOptions);
    toast({
      title: 'Produit ajouté',
      description: `${product.name} a été ajouté à votre panier`,
    });
  };

  const validateForm = (): boolean => {
    const isStreaming = ['netflix', 'spotify', 'disney-plus', 'amazon-prime-video', 'apple-tv-plus', 'crunchyroll', 'youtube-music', 'apple-music', 'deezer'].includes(slug);
    const isCODMobile = slug === 'cod-mobile-cp';
    const isMobileGame = ['pubg-mobile-uc', 'free-fire-diamonds', 'mobile-legends-diamonds', 'clash-royale-gems', 'clash-of-clans-gems', 'ea-fc-mobile-coins', 'efootball-mobile-coins', 'roblox-robux', 'brawl-stars-gems', 'genshin-impact', 'stumble-guys', '8-ball-pool'].includes(slug);
    const isGiftCard = product.category_id === '22222222-2222-2222-2222-222222222222';
    const isAccessory = product.type === 'physical';

    if (isStreaming) {
      return formData.accountEmail !== '' && formData.accountPassword !== '';
    }
    if (isCODMobile) {
      return formData.facebookEmail !== '' && formData.facebookPassword !== '' && formData.activisionEmail !== '' && formData.activisionPassword !== '';
    }
    if (isMobileGame) {
      return formData.userId !== '';
    }
    if (isGiftCard) {
      return formData.recipientEmail !== '';
    }
    if (isAccessory) {
      return formData.deliveryAddress !== '' && formData.phoneNumber !== '';
    }
    return true;
  };

  const isGamingAccessory = product.gallery_images || product.video_url;
  const galleryImages = product.gallery_images || [product.image_url];

  const calculatePrice = () => {
    let basePrice = product.price;
    
    // Streaming subscriptions
    const isStreaming = ['netflix', 'spotify', 'disney-plus', 'amazon-prime-video', 'apple-tv-plus', 'crunchyroll', 'youtube-music', 'apple-music', 'deezer'].includes(slug);
    if (isStreaming) {
      const multipliers: { [key: string]: number } = {
        '1-month': 1,
        '3-months': 2.7,
        '6-months': 5,
        '12-months': 9,
      };
      return basePrice * multipliers[formData.duration];
    }
    
    // Gift cards
    if (product.category_id === '22222222-2222-2222-2222-222222222222') {
      return parseInt(formData.amount) * 700; // 1€ = 700 FCFA
    }
    
    // Mobile game top-ups
    if (product.category_id === '33333333-3333-3333-3333-333333333333') {
      const quantities: { [key: string]: number } = {
        '100': 5000,
        '300': 14000,
        '500': 22000,
        '1000': 40000,
        '2000': 75000,
      };
      return quantities[formData.quantity] || basePrice;
    }
    
    return basePrice;
  };

  const renderProductForm = () => {
    // Netflix, Disney+, Amazon Prime, Apple TV+, Crunchyroll
    if (['netflix', 'disney-plus', 'amazon-prime-video', 'apple-tv-plus', 'crunchyroll'].includes(slug)) {
      return (
        <Card className="animate-fade-in-scale stagger-2">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg mb-4">
              <ChevronRight className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Important:</strong> Pour vous abonner à {product.name}, nous avons besoin de vos identifiants de compte pour effectuer le paiement en votre nom.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Durée d'abonnement</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: '1-month', label: '1 Mois' },
                  { value: '3-months', label: '3 Mois' },
                  { value: '6-months', label: '6 Mois' },
                  { value: '12-months', label: '12 Mois' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('duration', option.value)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.duration === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="account-email" className="text-red-600 dark:text-red-400">
                Email du compte {product.name} *
              </Label>
              <Input
                id="account-email"
                type="email"
                placeholder={`votre-email@${slug}.com`}
                value={formData.accountEmail}
                onChange={(e) => handleInputChange('accountEmail', e.target.value)}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="account-password" className="text-red-600 dark:text-red-400">
                Mot de passe du compte {product.name} *
              </Label>
              <Input
                id="account-password"
                type="password"
                placeholder="Votre mot de passe"
                value={formData.accountPassword}
                onChange={(e) => handleInputChange('accountPassword', e.target.value)}
                className="mt-2"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                🔒 Vos informations sont sécurisées et utilisées uniquement pour le paiement de votre abonnement
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Notes supplémentaires (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Informations complémentaires..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      );
    }

    // Spotify, YouTube Music, Apple Music, Deezer
    if (['spotify', 'youtube-music', 'apple-music', 'deezer'].includes(slug)) {
      return (
        <Card className="animate-fade-in-scale stagger-2">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-2 p-3 bg-purple-50 dark:bg-purple-950/30 rounded-lg mb-4">
              <ChevronRight className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-purple-900 dark:text-purple-100">
                <strong>Abonnement {product.name}:</strong> Nous nous connecterons à votre compte pour activer votre abonnement Premium.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Durée d'abonnement</Label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { value: '1-month', label: '1 Mois' },
                  { value: '3-months', label: '3 Mois' },
                  { value: '6-months', label: '6 Mois' },
                  { value: '12-months', label: '12 Mois' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleInputChange('duration', option.value)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.duration === option.value
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="account-email" className="text-red-600 dark:text-red-400">
                Email du compte {product.name} *
              </Label>
              <Input
                id="account-email"
                type="email"
                placeholder="votre-email@exemple.com"
                value={formData.accountEmail}
                onChange={(e) => handleInputChange('accountEmail', e.target.value)}
                className="mt-2"
                required
              />
            </div>

            <div>
              <Label htmlFor="account-password" className="text-red-600 dark:text-red-400">
                Mot de passe du compte {product.name} *
              </Label>
              <Input
                id="account-password"
                type="password"
                placeholder="Votre mot de passe"
                value={formData.accountPassword}
                onChange={(e) => handleInputChange('accountPassword', e.target.value)}
                className="mt-2"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                🔒 Connexion sécurisée pour activer votre Premium
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // COD Mobile - Facebook + Activision login
    if (slug === 'cod-mobile-cp') {
      return (
        <Card className="animate-fade-in-scale stagger-2">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-2 p-3 bg-orange-50 dark:bg-orange-950/30 rounded-lg mb-4">
              <ChevronRight className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-orange-900 dark:text-orange-100">
                <strong>Recharge COD Mobile:</strong> Nous nous connectons via Facebook et Activision pour acheter les CP directement sur votre compte.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Quantité de CP</Label>
              <Select value={formData.quantity} onValueChange={(value) => handleInputChange('quantity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 CP - 5,000 FCFA</SelectItem>
                  <SelectItem value="300">300 CP - 14,000 FCFA</SelectItem>
                  <SelectItem value="500">500 CP - 22,000 FCFA</SelectItem>
                  <SelectItem value="1000">1000 CP - 40,000 FCFA</SelectItem>
                  <SelectItem value="2000">2000 CP - 75,000 FCFA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 text-xs font-bold">1</span>
                Identifiants Facebook
              </h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="facebook-email" className="text-red-600 dark:text-red-400">Email Facebook *</Label>
                  <Input
                    id="facebook-email"
                    type="email"
                    placeholder="votre-email@facebook.com"
                    value={formData.facebookEmail}
                    onChange={(e) => handleInputChange('facebookEmail', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="facebook-password" className="text-red-600 dark:text-red-400">Mot de passe Facebook *</Label>
                  <Input
                    id="facebook-password"
                    type="password"
                    placeholder="Mot de passe Facebook"
                    value={formData.facebookPassword}
                    onChange={(e) => handleInputChange('facebookPassword', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300 text-xs font-bold">2</span>
                Identifiants Activision
              </h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="activision-email" className="text-red-600 dark:text-red-400">Email Activision *</Label>
                  <Input
                    id="activision-email"
                    type="email"
                    placeholder="votre-email@activision.com"
                    value={formData.activisionEmail}
                    onChange={(e) => handleInputChange('activisionEmail', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="activision-password" className="text-red-600 dark:text-red-400">Mot de passe Activision *</Label>
                  <Input
                    id="activision-password"
                    type="password"
                    placeholder="Mot de passe Activision"
                    value={formData.activisionPassword}
                    onChange={(e) => handleInputChange('activisionPassword', e.target.value)}
                    className="mt-2"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">
                🔒 <strong>Sécurité garantie:</strong> Vos identifiants sont utilisés uniquement pour l'achat des CP et ne sont jamais stockés.
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Free Fire, PUBG Mobile, Mobile Legends, other mobile games - User ID only
    if (['free-fire-diamonds', 'pubg-mobile-uc', 'mobile-legends-diamonds', 'clash-royale-gems', 'clash-of-clans-gems', 'ea-fc-mobile-coins', 'efootball-mobile-coins', 'roblox-robux', 'brawl-stars-gems', 'genshin-impact', 'stumble-guys', '8-ball-pool'].includes(slug)) {
      return (
        <Card className="animate-fade-in-scale stagger-2">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-start gap-2 p-3 bg-green-50 dark:bg-green-950/30 rounded-lg mb-4">
              <ChevronRight className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm text-green-900 dark:text-green-100">
                <strong>Recharge {product.name}:</strong> Nous utilisons votre ID de joueur pour effectuer la recharge directement sur votre compte.
              </p>
            </div>

            <div className="space-y-3">
              <Label>Quantité</Label>
              <Select value={formData.quantity} onValueChange={(value) => handleInputChange('quantity', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100">100 - 5,000 FCFA</SelectItem>
                  <SelectItem value="300">300 - 14,000 FCFA</SelectItem>
                  <SelectItem value="500">500 - 22,000 FCFA</SelectItem>
                  <SelectItem value="1000">1000 - 40,000 FCFA</SelectItem>
                  <SelectItem value="2000">2000 - 75,000 FCFA</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="user-id" className="text-red-600 dark:text-red-400">
                ID Utilisateur / Player ID *
              </Label>
              <Input
                id="user-id"
                type="text"
                placeholder="Votre ID dans le jeu"
                value={formData.userId}
                onChange={(e) => handleInputChange('userId', e.target.value)}
                className="mt-2 font-mono"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                ℹ️ Trouvez votre ID dans les paramètres du jeu
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Notes supplémentaires (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Serveur, région, ou autres informations..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      );
    }

    // Gift Cards - Amount and recipient email
    if (product.category_id === '22222222-2222-2222-2222-222222222222') {
      return (
        <Card className="animate-fade-in-scale stagger-2">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold mb-4">Options de la carte cadeau</h3>

            <div className="space-y-3">
              <Label>Montant</Label>
              <div className="grid grid-cols-3 gap-2">
                {['5', '10', '25', '50', '100'].map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleInputChange('amount', amount)}
                    className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                      formData.amount === amount
                        ? 'border-primary bg-primary/10 text-primary'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    {amount}€
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="recipient-email" className="text-red-600 dark:text-red-400">Email du destinataire *</Label>
              <Input
                id="recipient-email"
                type="email"
                placeholder="destinataire@email.com"
                value={formData.recipientEmail}
                onChange={(e) => handleInputChange('recipientEmail', e.target.value)}
                className="mt-2"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                Le code sera envoyé à cette adresse email
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Message personnalisé (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Ajoutez un message pour le destinataire..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-2"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      );
    }

    // Gaming Accessories - Color, address, phone
    if (product.type === 'physical') {
      return (
        <Card className="animate-fade-in-scale stagger-2">
          <CardContent className="p-6 space-y-4">
            <h3 className="font-semibold mb-4">Options de livraison</h3>

            {galleryImages.length > 1 && (
              <div className="space-y-3">
                <Label>Couleur / Variante</Label>
                <div className="grid grid-cols-2 gap-2">
                  {['Défaut', 'Blanc', 'Noir', 'Rouge', 'Bleu'].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleInputChange('color', color.toLowerCase())}
                      className={`px-4 py-3 rounded-lg border-2 font-medium transition-all ${
                        formData.color === color.toLowerCase()
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="delivery-address" className="text-red-600 dark:text-red-400">Adresse de livraison *</Label>
              <Textarea
                id="delivery-address"
                placeholder="Numéro, rue, quartier, ville..."
                value={formData.deliveryAddress}
                onChange={(e) => handleInputChange('deliveryAddress', e.target.value)}
                className="mt-2"
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="phone-number" className="text-red-600 dark:text-red-400">Numéro de téléphone *</Label>
              <Input
                id="phone-number"
                type="tel"
                placeholder="+241 XX XX XX XX"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                className="mt-2"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">
                📞 Pour vous contacter lors de la livraison
              </p>
            </div>

            <div>
              <Label htmlFor="notes">Instructions de livraison (optionnel)</Label>
              <Textarea
                id="notes"
                placeholder="Point de repère, horaires préférés..."
                value={formData.notes}
                onChange={(e) => handleInputChange('notes', e.target.value)}
                className="mt-2"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>
      );
    }

    // Default form for other products
    return (
      <Card className="animate-fade-in-scale stagger-2">
        <CardContent className="p-6">
          <p className="text-muted-foreground">
            Produit prêt à être commandé. Cliquez sur "Ajouter au panier" pour continuer.
          </p>
        </CardContent>
      </Card>
    );
  };

  const renderSimpleProductForm = () => {
    // Netflix, Disney+, Streaming
    if (['netflix-premium-1-mois', 'spotify-premium-3-mois', 'disney-plus-1-mois', 'youtube-premium-1-mois'].includes(slug)) {
      return (
        <>
          <div>
            <Label htmlFor="subscription-type">Type d'abonnement</Label>
            <Select defaultValue="1-month">
              <SelectTrigger id="subscription-type" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1-month">1 Mois</SelectItem>
                <SelectItem value="3-months">3 Mois</SelectItem>
                <SelectItem value="6-months">6 Mois</SelectItem>
                <SelectItem value="12-months">12 Mois</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="account-email">Email du compte (pour réabonnement)</Label>
            <Input
              id="account-email"
              type="email"
              placeholder="Email du compte (pour réabonnement)"
              className="mt-2"
            />
          </div>
          <div>
            <Label htmlFor="account-password">Mot de passe du compte</Label>
            <Input
              id="account-password"
              type="password"
              placeholder="Mot de passe du compte"
              className="mt-2"
            />
          </div>
        </>
      );
    }

    // COD Mobile
    if (slug === 'cod-mobile-1100-cp') {
      return (
        <>
          <div>
            <Label htmlFor="cp-quantity">Quantité de CP</Label>
            <Select defaultValue="1100">
              <SelectTrigger id="cp-quantity" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100 CP</SelectItem>
                <SelectItem value="320">320 CP</SelectItem>
                <SelectItem value="800">800 CP</SelectItem>
                <SelectItem value="1100">1100 CP</SelectItem>
                <SelectItem value="2400">2400 CP</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );
    }

    // Free Fire, PUBG, Mobile Games
    if (['free-fire-1080', 'pubg-660-uc', 'ml-706-diamonds'].includes(slug)) {
      return (
        <>
          <div>
            <Label htmlFor="game-quantity">Quantité</Label>
            <Select defaultValue="1080">
              <SelectTrigger id="game-quantity" className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="310">310</SelectItem>
                <SelectItem value="520">520</SelectItem>
                <SelectItem value="1080">1080</SelectItem>
                <SelectItem value="2200">2200</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="user-id">ID Utilisateur</Label>
            <Input
              id="user-id"
              type="text"
              placeholder="Votre ID dans le jeu"
              className="mt-2"
            />
          </div>
        </>
      );
    }

    // PS5 DualSense and accessories
    if (slug === 'ps5-dualsense' || product.type === 'physical') {
      return (
        <>
          <div>
            <Label htmlFor="color">Couleur</Label>
            <Select defaultValue="default">
              <SelectTrigger id="color" className="mt-2">
                <SelectValue placeholder="Sélectionnez une variante" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Standard</SelectItem>
                <SelectItem value="white">Blanc</SelectItem>
                <SelectItem value="black">Noir</SelectItem>
                <SelectItem value="red">Rouge</SelectItem>
                <SelectItem value="blue">Bleu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      );
    }

    // Gift cards - PSN, Xbox, etc - No options needed
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          {/* Breadcrumb navigation like Digital Play */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
            <Link href="/" className="hover:text-foreground transition-colors">Accueil</Link>
            <ChevronRight className="h-4 w-4" />
            <Link href="/products" className="hover:text-foreground transition-colors">Produits</Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground">{product.name}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-8 mb-16">
            {/* Left: Product Image */}
            <div>
              <div className="aspect-[4/3] overflow-hidden rounded-xl bg-muted/50 relative mb-4 border">
                {showVideo && product.video_url ? (
                  <video
                    src={product.video_url}
                    controls
                    autoPlay
                    loop
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={galleryImages[selectedImage] || "/placeholder.svg"}
                    alt={product.name}
                    className="h-full w-full object-cover"
                  />
                )}
              </div>
              
              {/* Thumbnail gallery for accessories */}
              {isGamingAccessory && galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {galleryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setSelectedImage(idx);
                        setShowVideo(false);
                      }}
                      className={`aspect-square overflow-hidden rounded-lg border-2 transition-all ${
                        selectedImage === idx && !showVideo
                          ? 'border-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <img
                        src={img || "/placeholder.svg"}
                        alt={`Vue ${idx + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Product Info - Compact like Digital Play */}
            <div className="flex flex-col gap-4">
              {/* Badge and Title */}
              <div>
                {product.is_featured && (
                  <Badge className="mb-3">Populaire</Badge>
                )}
                <h1 className="text-3xl font-bold mb-3">
                  {product.name}
                </h1>
                
                {/* Delivery time and stock */}
                <div className="flex items-center gap-4 text-sm mb-4">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {product.type === 'physical' ? '2-7 jours' : '5-10 minutes'}
                  </span>
                  {product.stock > 0 && (
                    <span className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <CheckCircle2 className="h-4 w-4" />
                      En stock ({product.stock})
                    </span>
                  )}
                </div>
              </div>

              <div className="text-4xl font-bold text-primary">
                {formatPrice(calculatePrice())}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>

              <div className="space-y-4 py-4">
                {renderSimpleProductForm()}
              </div>

              {/* Quantity input */}
              <div className="flex items-center gap-4">
                <Label className="text-base font-semibold">Quantité</Label>
                <Input
                  type="number"
                  min="1"
                  defaultValue="1"
                  className="w-24"
                />
              </div>

              <Button
                size="lg"
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="w-full gap-2 text-base py-6 bg-gradient-to-r from-primary to-purple-600 hover:opacity-90 transition-opacity"
              >
                <ShoppingCart className="h-5 w-5" />
                Ajouter au Panier
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
