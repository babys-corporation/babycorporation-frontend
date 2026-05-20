// helper para classes do botão
// substitui o cva, retorna a classe certa baseado na variante e tamanho

type Variante = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
type Tamanho = 'default' | 'sm' | 'lg' | 'icon'

export function getButtonClass(variante: Variante = 'default', tamanho: Tamanho = 'default') {
  return `btn btn-${variante} btn-${tamanho}`
}
