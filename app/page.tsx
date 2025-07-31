"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, ShoppingBag, Menu, Star, Heart, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useCart, type Product } from "@/contexts/cart-context"
import { CartSidebar } from "@/components/cart-sidebar"

const products: Product[] = [
  {
    id: 1,
    name: "Tênis Esportivo Premium",
    price: 299.9,
    originalPrice: 399.9,
    image: "/placeholder.svg?height=300&width=300",
    category: "Esportivo",
    rating: 4.8,
    reviews: 124,
    sizes: ["38", "39", "40", "41", "42", "43"],
    description: "Tênis esportivo de alta performance com tecnologia de amortecimento avançada.",
    features: ["Amortecimento premium", "Material respirável", "Solado antiderrapante", "Design ergonômico"],
    gender: "masculino",
    isBestSeller: true,
  },
  {
    id: 2,
    name: "Sapatênis Casual Urbano",
    price: 189.9,
    image: "/placeholder.svg?height=300&width=300",
    category: "Casual",
    rating: 4.6,
    reviews: 89,
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    description: "Sapatênis versátil que combina com qualquer look casual.",
    features: ["Couro sintético", "Palmilha acolchoada", "Fechamento em cadarço", "Versatilidade urbana"],
    gender: "masculino",
  },
  {
    id: 3,
    name: "Tênis Running Feminino",
    price: 349.9,
    image: "/placeholder.svg?height=300&width=300",
    category: "Running",
    rating: 4.9,
    reviews: 156,
    sizes: ["34", "35", "36", "37", "38", "39", "40"],
    description: "Tênis profissional para corrida com tecnologia de retorno de energia.",
    features: ["Retorno de energia", "Mesh respirável", "Suporte lateral", "Leveza extrema"],
    gender: "feminino",
    isBestSeller: true,
  },
  {
    id: 4,
    name: "Bota Coturno Clássico",
    price: 259.9,
    image: "/placeholder.svg?height=300&width=300",
    category: "Botas",
    rating: 4.7,
    reviews: 67,
    sizes: ["38", "39", "40", "41", "42", "43"],
    description: "Bota coturno em couro legítimo com design atemporal.",
    features: ["Couro legítimo", "Solado resistente", "Cadarço reforçado", "Design atemporal"],
    gender: "masculino",
  },
  {
    id: 5,
    name: "Tênis Skateboard Street",
    price: 219.9,
    image: "/placeholder.svg?height=300&width=300",
    category: "Skate",
    rating: 4.5,
    reviews: 93,
    sizes: ["35", "36", "37", "38", "39", "40", "41", "42", "43"],
    description: "Tênis especialmente desenvolvido para skateboard com grip superior.",
    features: ["Grip superior", "Reforço lateral", "Amortecimento no calcanhar", "Resistência ao desgaste"],
    gender: "unissex",
  },
  {
    id: 6,
    name: "Sapato Social Executivo",
    price: 389.9,
    image: "/placeholder.svg?height=300&width=300",
    category: "Social",
    rating: 4.8,
    reviews: 78,
    sizes: ["38", "39", "40", "41", "42", "43", "44"],
    description: "Sapato social em couro premium para executivos.",
    features: ["Couro premium", "Acabamento refinado", "Palmilha de couro", "Design executivo"],
    gender: "masculino",
    isBestSeller: true,
  },
  {
    id: 7,
    name: "Sandália Feminina Elegante",
    price: 159.9,
    image: "/placeholder.svg?height=300&width=300",
    category: "Sandálias",
    rating: 4.4,
    reviews: 92,
    sizes: ["34", "35", "36", "37", "38", "39", "40"],
    description: "Sandália feminina com design elegante e confortável.",
    features: ["Salto confortável", "Tiras ajustáveis", "Palmilha acolchoada", "Design moderno"],
    gender: "feminino",
  },
  {
    id: 8,
    name: "Tênis Casual Feminino",
    price: 229.9,
    originalPrice: 279.9,
    image: "/placeholder.svg?height=300&width=300",
    category: "Casual",
    rating: 4.7,
    reviews: 134,
    sizes: ["34", "35", "36", "37", "38", "39", "40"],
    description: "Tênis casual feminino com design moderno e confortável.",
    features: ["Design minimalista", "Conforto superior", "Material durável", "Versatilidade"],
    gender: "feminino",
    isBestSeller: true,
  },
]

export default function BlenzziCalcados() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [selectedSize, setSelectedSize] = useState<string>("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("todos")

  const { state, dispatch } = useCart()

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTab =
      activeTab === "todos" ||
      (activeTab === "mais-vendidos" && product.isBestSeller) ||
      (activeTab === "masculino" && product.gender === "masculino") ||
      (activeTab === "feminino" && product.gender === "feminino")

    return matchesSearch && matchesTab
  })

  const handleAddToCart = (product: Product, size: string) => {
    dispatch({ type: "ADD_TO_CART", payload: { product, size } })
    setSelectedProduct(null)
    setSelectedSize("")
  }

  const handleToggleFavorite = (productId: number) => {
    dispatch({ type: "TOGGLE_FAVORITE", payload: productId })
  }

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "fill-black text-black" : "text-gray-300"}`} />
    ))
  }

  const cartItemsCount = state.items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 sticky top-0 bg-white z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-black">BLENZZI</h1>
              <p className="text-xs text-gray-600 -mt-1">CALÇADOS</p>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <a href="#" className="text-black hover:text-gray-600 transition-colors">
                Início
              </a>
              <a href="#produtos" className="text-black hover:text-gray-600 transition-colors">
                Produtos
              </a>
              <a href="#" className="text-black hover:text-gray-600 transition-colors">
                Sobre
              </a>
              <a href="#" className="text-black hover:text-gray-600 transition-colors">
                Contato
              </a>
            </nav>

            {/* Search and Cart */}
            <div className="flex items-center space-x-4">
              <div className="hidden sm:block relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Buscar produtos..."
                  className="pl-10 w-64 border-gray-300 focus:border-black"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="text-black hover:text-gray-600 relative"
                onClick={() => setCartOpen(true)}
              >
                <ShoppingBag className="w-5 h-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartItemsCount}
                  </span>
                )}
              </Button>

              {/* Mobile menu button */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <nav className="flex flex-col space-y-4 mt-8">
                    <a href="#" className="text-black hover:text-gray-600 transition-colors text-lg">
                      Início
                    </a>
                    <a href="#produtos" className="text-black hover:text-gray-600 transition-colors text-lg">
                      Produtos
                    </a>
                    <a href="#" className="text-black hover:text-gray-600 transition-colors text-lg">
                      Sobre
                    </a>
                    <a href="#" className="text-black hover:text-gray-600 transition-colors text-lg">
                      Contato
                    </a>
                    <div className="pt-4">
                      <Input
                        type="text"
                        placeholder="Buscar produtos..."
                        className="w-full border-gray-300 focus:border-black"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">ESTILO E CONFORTO</h2>
          <p className="text-xl md:text-2xl mb-8 text-gray-300">Descubra nossa coleção exclusiva de calçados premium</p>
          <Button
            size="lg"
            className="bg-white text-black hover:bg-gray-100 px-8 py-3 text-lg"
            onClick={() => document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" })}
          >
            Ver Produtos
          </Button>
        </div>
      </section>

      {/* Products Section */}
      <section id="produtos" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-black mb-4">NOSSA COLEÇÃO</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Calçados selecionados com qualidade premium e design moderno para todas as ocasiões
            </p>
          </div>

          {/* Category Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="mais-vendidos">Mais Vendidos</TabsTrigger>
              <TabsTrigger value="masculino">Masculino</TabsTrigger>
              <TabsTrigger value="feminino">Feminino</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-gray-200"
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden" onClick={() => setSelectedProduct(product)}>
                        <Image
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          width={300}
                          height={300}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {product.originalPrice && (
                          <Badge className="absolute top-4 left-4 bg-black text-white">OFERTA</Badge>
                        )}
                        {product.isBestSeller && (
                          <Badge className="absolute top-4 right-4 bg-red-600 text-white">MAIS VENDIDO</Badge>
                        )}
                      </div>

                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <Badge variant="outline" className="text-xs">
                            {product.category}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {renderStars(product.rating)}
                            <span className="text-sm text-gray-600">({product.reviews})</span>
                          </div>
                        </div>

                        <h4
                          className="font-semibold text-lg mb-3 text-black group-hover:text-gray-700 transition-colors cursor-pointer"
                          onClick={() => setSelectedProduct(product)}
                        >
                          {product.name}
                        </h4>

                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-black">
                              R$ {product.price.toFixed(2).replace(".", ",")}
                            </span>
                            {product.originalPrice && (
                              <span className="text-sm text-gray-500 line-through">
                                R$ {product.originalPrice.toFixed(2).replace(".", ",")}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleFavorite(product.id)
                            }}
                            className={`${
                              state.favorites.includes(product.id)
                                ? "bg-black text-white hover:bg-gray-800"
                                : "hover:bg-gray-100"
                            }`}
                          >
                            <Heart
                              className={`w-4 h-4 ${state.favorites.includes(product.id) ? "fill-current" : ""}`}
                            />
                          </Button>
                          <Button
                            className="flex-1 bg-black text-white hover:bg-gray-800"
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedProduct(product)
                            }}
                          >
                            <Plus className="w-4 h-4 mr-2" />
                            Adicionar
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-600 text-lg">
                    {searchQuery
                      ? `Nenhum produto encontrado para "${searchQuery}"`
                      : "Nenhum produto encontrado nesta categoria"}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Product Detail Modal */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProduct && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  {selectedProduct.name}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleFavorite(selectedProduct.id)}
                    className={`${
                      state.favorites.includes(selectedProduct.id)
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-400 hover:text-gray-600"
                    }`}
                  >
                    <Heart
                      className={`w-5 h-5 ${state.favorites.includes(selectedProduct.id) ? "fill-current" : ""}`}
                    />
                  </Button>
                </DialogTitle>
              </DialogHeader>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <Image
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    width={400}
                    height={400}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-6">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant="outline">{selectedProduct.category}</Badge>
                      <Badge variant="outline">{selectedProduct.gender}</Badge>
                      {selectedProduct.isBestSeller && <Badge className="bg-red-600 text-white">MAIS VENDIDO</Badge>}
                      <div className="flex items-center space-x-1">
                        {renderStars(selectedProduct.rating)}
                        <span className="text-sm text-gray-600">({selectedProduct.reviews} avaliações)</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                      <span className="text-3xl font-bold text-black">
                        R$ {selectedProduct.price.toFixed(2).replace(".", ",")}
                      </span>
                      {selectedProduct.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">
                          R$ {selectedProduct.originalPrice.toFixed(2).replace(".", ",")}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-6">{selectedProduct.description}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Características:</h4>
                    <ul className="space-y-2">
                      {selectedProduct.features.map((feature, index) => (
                        <li key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-black rounded-full"></div>
                          <span className="text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Selecione o tamanho:</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {selectedProduct.sizes.map((size) => (
                        <Button
                          key={size}
                          variant={selectedSize === size ? "default" : "outline"}
                          className={`${
                            selectedSize === size ? "bg-black text-white" : "border-gray-300 hover:border-black"
                          }`}
                          onClick={() => setSelectedSize(size)}
                        >
                          {size}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <Button
                    size="lg"
                    className="w-full bg-black text-white hover:bg-gray-800"
                    disabled={!selectedSize}
                    onClick={() => selectedSize && handleAddToCart(selectedProduct, selectedSize)}
                  >
                    {selectedSize ? "ADICIONAR À SACOLA" : "SELECIONE UM TAMANHO"}
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Cart Sidebar */}
      <CartSidebar open={cartOpen} onOpenChange={setCartOpen} />

      {/* Footer */}
      <footer className="bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">BLENZZI CALÇADOS</h3>
              <p className="text-gray-400">
                Qualidade e estilo em cada passo. Sua loja de confiança para calçados premium.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Links Rápidos</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Início
                  </a>
                </li>
                <li>
                  <a href="#produtos" className="hover:text-white transition-colors">
                    Produtos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sobre
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Categorias</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Masculino
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Feminino
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Mais Vendidos
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Ofertas
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Contato</h4>
              <ul className="space-y-2 text-gray-400">
                <li>WhatsApp: (11) 99999-9999</li>
                <li>Email: contato@blenzzi.com</li>
                <li>Horário: Seg-Sex 9h às 18h</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Blenzzi Calçados. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
