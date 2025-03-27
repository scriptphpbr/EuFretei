import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Link } from "wouter";
import { ArrowLeft, FileText, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

const TermsPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Hero Section */}
        <section className="py-12 bg-gradient-to-br from-primary/10 to-white">
          <div className="container mx-auto px-4">
            <div className="flex items-center mb-8">
              <Button variant="ghost" asChild className="mr-2">
                <Link href="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
            </div>
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-4 rounded-full">
                  <FileText className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">Termos de Uso</h1>
              </div>
              <p className="text-gray-600 mb-4">Última atualização: 26 de março de 2023</p>
              <p className="text-lg text-gray-700">
                Bem-vindo ao FreteJá. Por favor, leia atentamente estes termos e condições antes de usar nossa plataforma.
              </p>
            </div>
          </div>
        </section>
        
        {/* Terms Content */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="prose prose-lg max-w-none">
                <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded mb-8">
                  <div className="flex gap-3">
                    <AlertTriangle className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="font-bold text-amber-800 mb-1">Importante</h3>
                      <p className="text-amber-700 m-0">
                        Ao utilizar o FreteJá, você concorda com estes Termos de Uso. Se você não concorda com qualquer parte destes termos, por favor, não utilize nossa plataforma.
                      </p>
                    </div>
                  </div>
                </div>
                
                <h2>1. Definições</h2>
                <p>
                  <strong>"FreteJá"</strong> ou <strong>"nós"</strong> refere-se à plataforma FreteJá e sua empresa operadora.
                </p>
                <p>
                  <strong>"Usuário"</strong> ou <strong>"você"</strong> refere-se a qualquer pessoa que acesse ou utilize a plataforma FreteJá.
                </p>
                <p>
                  <strong>"Motorista"</strong> refere-se a qualquer pessoa cadastrada na plataforma como prestador de serviços de frete.
                </p>
                <p>
                  <strong>"Plataforma"</strong> refere-se ao aplicativo, website e serviços relacionados do FreteJá.
                </p>
                
                <h2>2. Cadastro e Conta</h2>
                <p>
                  2.1. Para utilizar plenamente nossos serviços, você deve se cadastrar fornecendo informações precisas e atualizadas.
                </p>
                <p>
                  2.2. Você é responsável por manter a confidencialidade de sua senha e por todas as atividades realizadas com sua conta.
                </p>
                <p>
                  2.3. O FreteJá reserva-se o direito de recusar, suspender ou cancelar o cadastro de qualquer usuário, a qualquer momento, sem aviso prévio.
                </p>
                
                <h2>3. Uso da Plataforma</h2>
                <p>
                  3.1. Ao utilizar o FreteJá, você concorda em:
                </p>
                <ul>
                  <li>Fornecer informações precisas sobre você e seus fretes</li>
                  <li>Não utilizar a plataforma para fins ilegais ou não autorizados</li>
                  <li>Não tentar prejudicar o funcionamento da plataforma</li>
                  <li>Não compartilhar conteúdo ofensivo, difamatório ou ilegal</li>
                  <li>Respeitar os direitos de outros usuários e motoristas</li>
                </ul>
                
                <h2>4. Serviços de Frete</h2>
                <p>
                  4.1. O FreteJá atua como intermediário entre usuários e motoristas, facilitando a contratação de serviços de frete.
                </p>
                <p>
                  4.2. Não somos responsáveis diretamente pelos serviços prestados pelos motoristas, mas oferecemos mecanismos para garantir a qualidade e segurança.
                </p>
                <p>
                  4.3. O usuário é responsável por fornecer informações precisas sobre o frete, incluindo origem, destino, dimensões e peso da carga.
                </p>
                
                <h2>5. Pagamentos</h2>
                <p>
                  5.1. Ao solicitar um frete, você concorda em pagar o valor estabelecido na plataforma.
                </p>
                <p>
                  5.2. Os pagamentos são processados por plataformas seguras de terceiros. O FreteJá não armazena dados completos de cartão de crédito.
                </p>
                <p>
                  5.3. Taxas de serviço e comissões são cobradas tanto de usuários quanto de motoristas, conforme estabelecido em nossa política de preços.
                </p>
                
                <h2>6. Cancelamentos e Reembolsos</h2>
                <p>
                  6.1. Políticas de cancelamento:
                </p>
                <ul>
                  <li>Cancelamentos até 1 hora antes do horário agendado: reembolso integral</li>
                  <li>Cancelamentos com menos de 1 hora: taxa de 15% do valor</li>
                  <li>Não comparecimento sem cancelamento: taxa de 50% do valor</li>
                </ul>
                <p>
                  6.2. O FreteJá pode, a seu critério, oferecer reembolsos em circunstâncias excepcionais.
                </p>
                
                <h2>7. Avaliações e Feedback</h2>
                <p>
                  7.1. Após cada serviço, usuários e motoristas podem avaliar uns aos outros.
                </p>
                <p>
                  7.2. As avaliações devem ser honestas e baseadas na experiência real do serviço.
                </p>
                <p>
                  7.3. O FreteJá reserva-se o direito de remover avaliações que violem nossas políticas.
                </p>
                
                <h2>8. Privacidade</h2>
                <p>
                  8.1. Nossa Política de Privacidade explica como coletamos, usamos e protegemos suas informações pessoais.
                </p>
                <p>
                  8.2. Ao utilizar o FreteJá, você concorda com nossa <Link href="/privacy" className="text-primary hover:underline">Política de Privacidade</Link>.
                </p>
                
                <h2>9. Propriedade Intelectual</h2>
                <p>
                  9.1. Todo o conteúdo e o software disponíveis na plataforma FreteJá são de propriedade do FreteJá ou de seus licenciadores.
                </p>
                <p>
                  9.2. É proibido copiar, modificar, distribuir ou utilizar comercialmente qualquer conteúdo da plataforma sem autorização expressa.
                </p>
                
                <h2>10. Limitação de Responsabilidade</h2>
                <p>
                  10.1. O FreteJá não se responsabiliza por:
                </p>
                <ul>
                  <li>Ações ou condutas de motoristas ou usuários</li>
                  <li>Danos à carga durante o transporte</li>
                  <li>Atrasos causados por fatores externos (trânsito, clima, etc.)</li>
                  <li>Perdas financeiras resultantes do uso da plataforma</li>
                  <li>Indisponibilidade temporária da plataforma</li>
                </ul>
                
                <h2>11. Indenização</h2>
                <p>
                  11.1. Você concorda em indenizar e isentar o FreteJá, seus diretores, funcionários e agentes de quaisquer reclamações, perdas, danos, responsabilidades e despesas relacionadas ao seu uso da plataforma.
                </p>
                
                <h2>12. Modificações dos Termos</h2>
                <p>
                  12.1. O FreteJá pode modificar estes Termos de Uso a qualquer momento, publicando a versão atualizada na plataforma.
                </p>
                <p>
                  12.2. O uso contínuo da plataforma após as modificações constituirá sua aceitação dos novos termos.
                </p>
                
                <h2>13. Lei Aplicável</h2>
                <p>
                  13.1. Estes Termos de Uso são regidos pelas leis do Brasil.
                </p>
                <p>
                  13.2. Qualquer disputa relacionada a estes termos será submetida à jurisdição exclusiva dos tribunais de São Paulo, SP.
                </p>
                
                <h2>14. Contato</h2>
                <p>
                  14.1. Se você tiver dúvidas sobre estes Termos de Uso, entre em contato conosco pelo e-mail termos@freteja.com.br.
                </p>
              </div>
              
              <div className="mt-12 p-6 border border-gray-200 rounded-xl">
                <h3 className="font-bold text-xl mb-4">Aceitação dos Termos</h3>
                <p className="text-gray-700 mb-6">
                  Ao usar nossos serviços, você confirma que leu e concordou com estes Termos de Uso. Recomendamos que você revise estes termos periodicamente para estar ciente de quaisquer atualizações.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild>
                    <Link href="/">
                      Continuar Navegando
                    </Link>
                  </Button>
                  <Button variant="outline" asChild>
                    <Link href="/privacy">
                      Ver Política de Privacidade
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default TermsPage;