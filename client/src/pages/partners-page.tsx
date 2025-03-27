import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Link } from "wouter";
import { ArrowLeft, Building, ArrowRight, TrendingUp, Target, HandshakeIcon, Briefcase, DollarSign, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const PartnersPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-primary/10 to-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8">
              <Button variant="ghost" asChild className="mr-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
            </div>
            <div className="max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/2">
                  <h1 className="text-4xl md:text-5xl font-bold mb-6">
                    Torne-se um <span className="text-primary">Parceiro</span> do FreteJá
                  </h1>
                  <p className="text-lg text-gray-700 mb-8">
                    Expanda seu negócio e alcance novos clientes através da nossa plataforma líder em serviços de frete.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button size="lg" className="gap-2" asChild>
                      <Link href="/driver/register">
                        Seja Parceiro
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline">
                      Saber mais
                    </Button>
                  </div>
                </div>
                <div className="md:w-1/2">
                  <div className="rounded-xl bg-white shadow-xl border border-gray-100 p-8">
                    <div className="flex flex-col gap-6">
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <TrendingUp className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">Aumente suas receitas</h3>
                          <p className="text-gray-600">Acesso a uma base de clientes em crescimento</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Target className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">Marketing direcionado</h3>
                          <p className="text-gray-600">Visibilidade para clientes que precisam dos seus serviços</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <Briefcase className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg mb-1">Sem burocracia</h3>
                          <p className="text-gray-600">Processo de cadastro simples e rápido</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6">Benefícios para Parceiros</h2>
              <p className="text-lg text-gray-700">
                Junte-se a centenas de empresas e motoristas que já estão expandindo seus negócios com o FreteJá.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Aumente sua Receita</h3>
                  <p className="text-gray-600 mb-4">
                    Com nossa plataforma, você pode acessar uma grande base de clientes e aumentar significativamente suas receitas.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Mais solicitações de frete</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Pagamentos rápidos e seguros</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Preços competitivos</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <Building className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Cresça seu Negócio</h3>
                  <p className="text-gray-600 mb-4">
                    Nossa plataforma oferece ferramentas para ajudar você a expandir suas operações e gerenciar seu negócio.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Painel de controle dedicado</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Relatórios de desempenho</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Suporte para expansão</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="pt-6">
                  <div className="bg-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <HandshakeIcon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold text-xl mb-3">Parcerias Valiosas</h3>
                  <p className="text-gray-600 mb-4">
                    Conecte-se com outras empresas e crie parcerias estratégicas para expandir ainda mais seu negócio.
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Networking com outras empresas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Oportunidades de colaboração</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-primary" />
                      <span>Eventos exclusivos para parceiros</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How It Works Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6">Como Funciona</h2>
              <p className="text-lg text-gray-700">
                Tornar-se um parceiro do FreteJá é simples e rápido. Siga os passos abaixo para começar.
              </p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-[29px] md:left-[39px] w-[2px] bg-primary/30"></div>
                <div className="space-y-12">
                  <div className="flex gap-6 md:gap-12 items-start">
                    <div className="w-[60px] md:w-[80px] h-[60px] md:h-[80px] flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold">
                      1
                    </div>
                    <div className="pt-3">
                      <h3 className="text-xl md:text-2xl font-bold mb-2">Cadastre-se como Parceiro</h3>
                      <p className="text-gray-600 mb-4">
                        Preencha o formulário de cadastro de parceiros com informações sobre sua empresa ou serviços.
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">
                          ℹ️ Você precisará fornecer documentos como CNPJ ou MEI, além de informações sobre sua frota ou serviços.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 md:gap-12 items-start">
                    <div className="w-[60px] md:w-[80px] h-[60px] md:h-[80px] flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold">
                      2
                    </div>
                    <div className="pt-3">
                      <h3 className="text-xl md:text-2xl font-bold mb-2">Verificação e Aprovação</h3>
                      <p className="text-gray-600 mb-4">
                        Nossa equipe verificará suas informações e documentos para garantir a qualidade dos serviços.
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">
                          ℹ️ O processo de verificação geralmente leva de 1 a 3 dias úteis. Você receberá atualizações por e-mail.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 md:gap-12 items-start">
                    <div className="w-[60px] md:w-[80px] h-[60px] md:h-[80px] flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold">
                      3
                    </div>
                    <div className="pt-3">
                      <h3 className="text-xl md:text-2xl font-bold mb-2">Configure seu Perfil</h3>
                      <p className="text-gray-600 mb-4">
                        Personalize seu perfil de parceiro, definindo seus serviços, preços e área de atuação.
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">
                          ℹ️ Um perfil completo e detalhado aumenta suas chances de atrair clientes.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 md:gap-12 items-start">
                    <div className="w-[60px] md:w-[80px] h-[60px] md:h-[80px] flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center text-2xl md:text-3xl font-bold">
                      4
                    </div>
                    <div className="pt-3">
                      <h3 className="text-xl md:text-2xl font-bold mb-2">Comece a Receber Pedidos</h3>
                      <p className="text-gray-600 mb-4">
                        Após a aprovação, você começará a receber solicitações de frete que correspondam ao seu perfil.
                      </p>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <p className="text-sm text-gray-500">
                          ℹ️ Você pode aceitar ou recusar pedidos conforme sua disponibilidade e preferências.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-primary">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center text-white">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Pronto para Expandir seu Negócio?
              </h2>
              <p className="text-xl mb-8">
                Junte-se a milhares de parceiros que já estão crescendo com o FreteJá.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button size="lg" variant="secondary" className="gap-2" asChild>
                  <Link href="/driver/register">
                    Cadastre-se como Parceiro
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                  Fale com um Consultor
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold mb-6">O que Nossos Parceiros Dizem</h2>
              <p className="text-lg text-gray-700">
                Veja como o FreteJá tem ajudado empresas e motoristas a expandir seus negócios.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <Card className="bg-gray-50 border-none">
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <p className="text-gray-700 mb-4 flex-grow">
                      "Desde que me tornei parceiro do FreteJá, minha empresa de logística aumentou o faturamento em 40%. A plataforma é intuitiva e os clientes são de qualidade."
                    </p>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                      <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                        <svg className="w-full h-full text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <circle cx="12" cy="8" r="5" fill="currentColor" opacity="0.4" />
                          <path d="M20 18c0 2.5-3.5 4-8 4s-8-1.5-8-4c0-2.4 3.5-4 8-4s8 1.6 8 4z" fill="currentColor" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold">Ricardo Mendes</h4>
                        <p className="text-sm text-gray-500">Transportadora Express</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50 border-none">
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <p className="text-gray-700 mb-4 flex-grow">
                      "Como motorista autônomo, o FreteJá mudou minha vida. Tenho uma agenda muito mais preenchida e consigo escolher os fretes que mais se adequam à minha rotina."
                    </p>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                      <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                        <svg className="w-full h-full text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <circle cx="12" cy="8" r="5" fill="currentColor" opacity="0.4" />
                          <path d="M20 18c0 2.5-3.5 4-8 4s-8-1.5-8-4c0-2.4 3.5-4 8-4s8 1.6 8 4z" fill="currentColor" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold">André Soares</h4>
                        <p className="text-sm text-gray-500">Motorista Parceiro</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-gray-50 border-none">
                <CardContent className="pt-6">
                  <div className="flex flex-col h-full">
                    <p className="text-gray-700 mb-4 flex-grow">
                      "O que mais me impressiona no FreteJá é a facilidade para gerenciar os pedidos e a pontualidade nos pagamentos. Recomendo para todos os colegas do setor."
                    </p>
                    <div className="flex items-center gap-3 mt-4 pt-4 border-t border-gray-200">
                      <div className="w-12 h-12 bg-gray-300 rounded-full overflow-hidden">
                        <svg className="w-full h-full text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                          <circle cx="12" cy="8" r="5" fill="currentColor" opacity="0.4" />
                          <path d="M20 18c0 2.5-3.5 4-8 4s-8-1.5-8-4c0-2.4 3.5-4 8-4s8 1.6 8 4z" fill="currentColor" />
                        </svg>
                      </div>
                      <div>
                        <h4 className="font-bold">Mariana Costa</h4>
                        <p className="text-sm text-gray-500">Fretes & Logistics</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PartnersPage;