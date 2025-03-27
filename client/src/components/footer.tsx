import { Link } from "wouter";
import { Truck, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <Truck className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl text-white">
                Frete<span className="text-primary">Já</span>
              </span>
            </div>
            <p className="text-gray-400 mb-6">
              Conectando motoristas e usuários para serviços de frete de qualidade em todo o Brasil.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-gray-800">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-400 hover:text-primary transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition">
                  Quem Somos
                </Link>
              </li>
              <li>
                <Link href="/partners" className="text-gray-400 hover:text-primary transition">
                  Seja Parceiro
                </Link>
              </li>
              <li>
                <Link href="/driver/register" className="text-gray-400 hover:text-primary transition">
                  Seja Motorista
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-400 hover:text-primary transition">
                  Perguntas Frequentes
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-white mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-primary transition">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-primary transition">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-primary transition">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/refund" className="text-gray-400 hover:text-primary transition">
                  Política de Reembolso
                </Link>
              </li>
              <li>
                <Link href="/lgpd" className="text-gray-400 hover:text-primary transition">
                  LGPD
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-white mb-4">Contato</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                <span>Av. Paulista, 1000, São Paulo, SP, Brasil</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-primary" />
                <span>(11) 3000-0000</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-primary" />
                <span>contato@freteja.com.br</span>
              </li>
            </ul>
            
            <div className="mt-6">
              <Button className="w-full">Fale Conosco</Button>
            </div>
          </div>
        </div>
        
        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800 mt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} FreteJá. Todos os direitos reservados.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/about" className="text-gray-500 hover:text-gray-300 text-sm">
              Sobre Nós
            </Link>
            <Link href="/careers" className="text-gray-500 hover:text-gray-300 text-sm">
              Trabalhe Conosco
            </Link>
            <Link href="/blog" className="text-gray-500 hover:text-gray-300 text-sm">
              Blog
            </Link>
            <Link href="/press" className="text-gray-500 hover:text-gray-300 text-sm">
              Imprensa
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;