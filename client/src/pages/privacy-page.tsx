import { useEffect } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Link } from "wouter";
import { Shield, Lock, Eye, Database, UserCheck, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const PrivacyPage = () => {
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
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">Política de Privacidade</h1>
              </div>
              <p className="text-gray-600 mb-4">Última atualização: 26 de março de 2023</p>
              <p className="text-lg text-gray-700">
                A proteção de seus dados pessoais é importante para nós. Esta Política de Privacidade explica como coletamos, usamos e protegemos suas informações.
              </p>
            </div>
          </div>
        </section>
        
        {/* Privacy Content */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <Lock className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Segurança</h3>
                  <p className="text-gray-600">Seus dados são protegidos com as melhores práticas de segurança</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <Eye className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Transparência</h3>
                  <p className="text-gray-600">Explicamos claramente como usamos suas informações</p>
                </div>
                <div className="bg-gray-50 p-6 rounded-xl text-center">
                  <UserCheck className="h-10 w-10 text-primary mx-auto mb-4" />
                  <h3 className="font-bold text-lg mb-2">Controle</h3>
                  <p className="text-gray-600">Você tem controle sobre seus dados pessoais</p>
                </div>
              </div>
              
              <div className="prose prose-lg max-w-none">
                <h2>1. Informações que Coletamos</h2>
                <p>
                  Coletamos informações que você nos fornece diretamente ao se cadastrar ou utilizar nossa plataforma:
                </p>
                <ul>
                  <li>Informações de cadastro (nome, e-mail, telefone, etc.)</li>
                  <li>Informações de pagamento</li>
                  <li>Localização (para serviços de frete)</li>
                  <li>Avaliações e feedbacks</li>
                  <li>Comunicações com nossa plataforma</li>
                </ul>
                
                <p>
                  Para motoristas, também coletamos:
                </p>
                <ul>
                  <li>Dados do veículo</li>
                  <li>Informações de CNH</li>
                  <li>Histórico de fretes realizados</li>
                </ul>
                
                <h2>2. Como Usamos Suas Informações</h2>
                <p>
                  Utilizamos suas informações para:
                </p>
                <ul>
                  <li>Fornecer e melhorar nossos serviços</li>
                  <li>Processar pagamentos</li>
                  <li>Conectar usuários e motoristas</li>
                  <li>Enviar atualizações e notificações</li>
                  <li>Verificar identidades e prevenir fraudes</li>
                  <li>Analisar o uso da plataforma</li>
                </ul>
                
                <h2>3. Compartilhamento de Informações</h2>
                <p>
                  Podemos compartilhar suas informações com:
                </p>
                <ul>
                  <li>Outros usuários da plataforma (ex: quando um usuário contrata um motorista)</li>
                  <li>Provedores de serviço que nos ajudam a operar a plataforma</li>
                  <li>Autoridades, quando exigido por lei</li>
                </ul>
                
                <p>
                  Não vendemos seus dados pessoais a terceiros.
                </p>
                
                <h2>4. Armazenamento e Segurança</h2>
                <p>
                  Implementamos medidas técnicas e organizacionais para proteger suas informações contra acesso não autorizado, alteração, divulgação ou destruição. No entanto, nenhum sistema é completamente seguro, e não podemos garantir a segurança absoluta de seus dados.
                </p>
                
                <h2>5. Seus Direitos</h2>
                <p>
                  Você tem direito a:
                </p>
                <ul>
                  <li>Acessar seus dados pessoais</li>
                  <li>Corrigir informações imprecisas</li>
                  <li>Excluir seus dados (com algumas limitações)</li>
                  <li>Restringir ou opor-se ao processamento de seus dados</li>
                  <li>Solicitar a portabilidade de seus dados</li>
                </ul>
                
                <p>
                  Para exercer esses direitos, entre em contato conosco através do e-mail privacidade@freteja.com.br.
                </p>
                
                <h2>6. Cookies e Tecnologias Similares</h2>
                <p>
                  Utilizamos cookies e tecnologias similares para melhorar sua experiência, entender como você usa nossa plataforma e personalizar nossos serviços. Você pode gerenciar suas preferências de cookies através das configurações do seu navegador.
                </p>
                
                <h2>7. Menores de Idade</h2>
                <p>
                  Nossos serviços não são destinados a menores de 18 anos. Não coletamos intencionalmente informações de menores. Se você acredita que coletamos informações de um menor, entre em contato conosco imediatamente.
                </p>
                
                <h2>8. Alterações nesta Política</h2>
                <p>
                  Podemos atualizar esta Política de Privacidade periodicamente. Se fizermos alterações significativas, notificaremos você através da plataforma ou por e-mail. A data da última atualização está indicada no início desta política.
                </p>
                
                <h2>9. Contato</h2>
                <p>
                  Se você tiver dúvidas ou preocupações sobre esta Política de Privacidade ou sobre como tratamos seus dados pessoais, entre em contato conosco pelo e-mail privacidade@freteja.com.br.
                </p>
              </div>
              
              <div className="mt-12 p-6 bg-primary/5 rounded-xl">
                <h3 className="font-bold text-xl mb-4 flex items-center">
                  <Database className="h-5 w-5 mr-2 text-primary" />
                  Compromisso com a LGPD
                </h3>
                <p className="text-gray-700 mb-4">
                  O FreteJá está comprometido com o cumprimento da Lei Geral de Proteção de Dados (LGPD) e outras leis de privacidade aplicáveis. Respeitamos seus direitos de privacidade e estamos dedicados a proteger suas informações pessoais.
                </p>
                <Button>Saiba mais sobre a LGPD</Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default PrivacyPage;