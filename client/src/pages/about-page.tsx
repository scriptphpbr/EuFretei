import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  Users, 
  Target, 
  Award, 
  Truck, 
  ShieldCheck, 
  Clock, 
  Globe, 
  TrendingUp,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
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
                    Sobre o <span className="text-primary">FreteJá</span>
                  </h1>
                  <p className="text-lg text-gray-700 mb-8">
                    Somos uma plataforma inovadora de logística que conecta usuários a motoristas qualificados para serviços de frete com segurança, transparência e preços justos.
                  </p>
                </div>
                <div className="md:w-1/2">
                  <div className="relative rounded-2xl overflow-hidden bg-white shadow-xl border border-gray-100 aspect-video">
                    <svg className="w-full h-full text-gray-400" viewBox="0 0 600 400" xmlns="http://www.w3.org/2000/svg">
                      <rect width="600" height="400" fill="#f9fafb" />
                      <path d="M0,400 L600,400 L600,300 Q500,250 400,300 T200,280 T0,300 Z" fill="#22C55E" opacity="0.2" />
                      <path d="M0,400 L600,400 L600,320 Q500,280 400,320 T200,300 T0,320 Z" fill="#16A34A" opacity="0.4" />
                      <g transform="translate(280, 200)">
                        <circle r="40" fill="#22C55E" />
                        <path d="M-20,-10 L-5,10 L20,-10" stroke="white" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                      </g>
                      <g transform="translate(100, 100)">
                        <rect width="80" height="80" fill="#22C55E" opacity="0.3" rx="8" />
                      </g>
                      <g transform="translate(440, 120)">
                        <rect width="60" height="60" fill="#22C55E" opacity="0.3" rx="30" />
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-gray-50 border-none">
                  <CardContent className="pt-6">
                    <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                      <Target className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">Nossa Missão</h3>
                    <p className="text-gray-700">
                      Transformar o mercado de fretes, tornando-o mais acessível, seguro e eficiente para todos os envolvidos, com foco em tecnologia e excelência em atendimento.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 border-none">
                  <CardContent className="pt-6">
                    <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                      <Award className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">Nossa Visão</h3>
                    <p className="text-gray-700">
                      Ser a principal plataforma de logística do Brasil, reconhecida pela qualidade, segurança e inovação, expandindo para toda a América Latina até 2026.
                    </p>
                  </CardContent>
                </Card>
                
                <Card className="bg-gray-50 border-none">
                  <CardContent className="pt-6">
                    <div className="bg-primary/10 w-14 h-14 rounded-full flex items-center justify-center mb-5">
                      <ShieldCheck className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-bold text-xl mb-3">Nossos Valores</h3>
                    <p className="text-gray-700">
                      Pautamos nossas ações em transparência, responsabilidade, inovação, respeito ao cliente e ao motorista, e compromisso com a excelência em cada entrega.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
        
        {/* Story Section */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Nossa História</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  Como nasceu e cresceu o FreteJá, desde nossa fundação até os dias de hoje.
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute top-0 bottom-0 left-[29px] md:left-[29px] w-[2px] bg-primary/30"></div>
                <div className="space-y-12">
                  <div className="flex gap-6 items-start">
                    <div className="w-[60px] h-[60px] flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                      2020
                    </div>
                    <div className="pt-3">
                      <h3 className="text-xl font-bold mb-2">Fundação</h3>
                      <p className="text-gray-600 mb-4">
                        O FreteJá nasceu da visão de três amigos empreendedores que identificaram as dificuldades do mercado de fretes no Brasil. Com um investimento inicial modesto, começamos a desenvolver a primeira versão da plataforma.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 items-start">
                    <div className="w-[60px] h-[60px] flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                      2021
                    </div>
                    <div className="pt-3">
                      <h3 className="text-xl font-bold mb-2">Lançamento e Expansão</h3>
                      <p className="text-gray-600 mb-4">
                        Lançamos nossa primeira versão em São Paulo. Em seis meses, atingimos a marca de 500 motoristas cadastrados e 2.000 usuários ativos. Recebemos nossa primeira rodada de investimento.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 items-start">
                    <div className="w-[60px] h-[60px] flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                      2022
                    </div>
                    <div className="pt-3">
                      <h3 className="text-xl font-bold mb-2">Crescimento e Reconhecimento</h3>
                      <p className="text-gray-600 mb-4">
                        Expandimos para as principais capitais do Brasil e fomos reconhecidos como uma das startups mais promissoras no setor de logística. Nossa base de motoristas chegou a 2.000 e de usuários a 15.000.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 items-start">
                    <div className="w-[60px] h-[60px] flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                      2023
                    </div>
                    <div className="pt-3">
                      <h3 className="text-xl font-bold mb-2">Modernização e Novas Funcionalidades</h3>
                      <p className="text-gray-600 mb-4">
                        Relançamos a plataforma com novas funcionalidades, incluindo rastreamento em tempo real, sistema de avaliação aprimorado e pagamentos instantâneos para motoristas. Ultrapassamos 5.000 motoristas e 50.000 usuários.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-6 items-start">
                    <div className="w-[60px] h-[60px] flex-shrink-0 bg-primary text-white rounded-full flex items-center justify-center text-xl font-bold">
                      Hoje
                    </div>
                    <div className="pt-3">
                      <h3 className="text-xl font-bold mb-2">Liderança e Inovação Contínua</h3>
                      <p className="text-gray-600 mb-4">
                        Hoje somos referência no mercado de fretes, com presença em todo o território nacional, mais de 10.000 motoristas parceiros e 100.000 usuários ativos. Continuamos inovando e expandindo nossos serviços.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Nossa Equipe</h2>
                <p className="text-lg text-gray-700 max-w-3xl mx-auto">
                  Conheça os profissionais dedicados que fazem o FreteJá acontecer todos os dias.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                    <svg className="w-full h-full text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="5" fill="currentColor" opacity="0.4" />
                      <path d="M20 18c0 2.5-3.5 4-8 4s-8-1.5-8-4c0-2.4 3.5-4 8-4s8 1.6 8 4z" fill="currentColor" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl mb-1">Pedro Oliveira</h3>
                  <p className="text-gray-500 mb-3">CEO & Co-Fundador</p>
                  <p className="text-gray-600 px-4">
                    Com mais de 15 anos de experiência em logística e tecnologia, Pedro lidera nossa visão estratégica.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                    <svg className="w-full h-full text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="5" fill="currentColor" opacity="0.4" />
                      <path d="M20 18c0 2.5-3.5 4-8 4s-8-1.5-8-4c0-2.4 3.5-4 8-4s8 1.6 8 4z" fill="currentColor" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl mb-1">Marina Santos</h3>
                  <p className="text-gray-500 mb-3">CTO & Co-Fundadora</p>
                  <p className="text-gray-600 px-4">
                    Especialista em desenvolvimento de software, Marina lidera nossa equipe de tecnologia e inovação.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 overflow-hidden">
                    <svg className="w-full h-full text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <circle cx="12" cy="8" r="5" fill="currentColor" opacity="0.4" />
                      <path d="M20 18c0 2.5-3.5 4-8 4s-8-1.5-8-4c0-2.4 3.5-4 8-4s8 1.6 8 4z" fill="currentColor" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-xl mb-1">Rafael Costa</h3>
                  <p className="text-gray-500 mb-3">COO & Co-Fundador</p>
                  <p className="text-gray-600 px-4">
                    Com background em gestão de operações, Rafael otimiza nossos processos para máxima eficiência.
                  </p>
                </div>
              </div>
              
              <div className="text-center mt-10">
                <Button variant="outline" className="gap-2">
                  Conheça toda a equipe
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Stats Section */}
        <section className="py-16 bg-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">FreteJá em Números</h2>
                <p className="text-lg opacity-80 max-w-3xl mx-auto">
                  O impacto da nossa plataforma no mercado de fretes brasileiro.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Users className="h-8 w-8" />
                  </div>
                  <div className="text-4xl font-bold mb-2">100k+</div>
                  <p className="opacity-80">Usuários Ativos</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Truck className="h-8 w-8" />
                  </div>
                  <div className="text-4xl font-bold mb-2">10k+</div>
                  <p className="opacity-80">Motoristas Parceiros</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Globe className="h-8 w-8" />
                  </div>
                  <div className="text-4xl font-bold mb-2">500+</div>
                  <p className="opacity-80">Cidades Atendidas</p>
                </div>
                
                <div className="text-center">
                  <div className="bg-white/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-8 w-8" />
                  </div>
                  <div className="text-4xl font-bold mb-2">1M+</div>
                  <p className="opacity-80">Fretes Realizados</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-gray-50 rounded-2xl p-8 md:p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Junte-se ao FreteJá</h2>
              <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
                Seja como usuário ou motorista parceiro, faça parte da revolução no mercado de fretes no Brasil.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="gap-2">
                  Cadastre-se Agora
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Saiba Mais
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default AboutPage;