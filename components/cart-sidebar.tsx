"use client"

import { X, Plus, Minus, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useCart } from "@/contexts/cart-context"
import Image from "next/image"

interface CartSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CartSidebar({ open, onOpenChange }: CartSidebarProps) {
  const { state, dispatch } = useCart()

  const total = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleWhatsAppCheckout = () => {
    if (state.items.length === 0) return

    const itemsList = state.items
      .map(
        (item) =>
          `${item.name} - Tamanho: ${item.selectedSize} - Qtd: ${item.quantity} - R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}`,
      )
      .join("\n")

    const message = `Olá! Gostaria de finalizar minha compra:\n\n${itemsList}\n\nTotal: R$ ${total.toFixed(2).replace(".", ",")}`
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Minha Sacola ({state.items.length})
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-6">
            {state.items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Sua sacola está vazia</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={`${item.id}-${item.selectedSize}`} className="flex gap-4 p-4 border rounded-lg">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      width={80}
                      height={80}
                      className="w-20 h-20 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-sm text-gray-600">Tamanho: {item.selectedSize}</p>
                      <p className="font-bold">R$ {item.price.toFixed(2).replace(".", ",")}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-transparent"
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: {
                                id: item.id,
                                size: item.selectedSize,
                                quantity: Math.max(1, item.quantity - 1),
                              },
                            })
                          }
                        >
                          <Minus className="w-3 h-3" />
                        </Button>
                        <span className="w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="w-8 h-8 bg-transparent"
                          onClick={() =>
                            dispatch({
                              type: "UPDATE_QUANTITY",
                              payload: {
                                id: item.id,
                                size: item.selectedSize,
                                quantity: item.quantity + 1,
                              },
                            })
                          }
                        >
                          <Plus className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {state.items.length > 0 && (
            <div className="border-t pt-4 space-y-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span>R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
              <Button className="w-full bg-black text-white hover:bg-gray-800" onClick={handleWhatsAppCheckout}>
                FINALIZAR VIA WHATSAPP
              </Button>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
