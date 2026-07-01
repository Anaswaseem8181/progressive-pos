import { Link } from 'react-router-dom';
import { TwitterIcon } from '../../assets/icons/svg/TwitterIcon';
import { GithubIcon } from '../../assets/icons/svg/GithubIcon';
import { useAuth } from '../../hooks/useAuth';

const Footer = () => {
  const { user } = useAuth();
  return (
    <footer className="bg-white pt-16 pb-8 border-t border-slate-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 mb-16">
          <div className="col-span-2 lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                {user?.businessName || "Progressive POS"}
              </span>
            </div>
            <p className="text-slate-500 max-w-sm mb-6 leading-relaxed">
              The smartest way to manage your inventory, process sales, and understand your business, beautifully packaged in an offline-capable web application.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Product</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Features</Link></li>
              <li><Link to="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Integrations</Link></li>
              <li><Link to="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Pricing</Link></li>
              <li><Link to="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Changelog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Company</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">About Us</Link></li>
              <li><Link to="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Careers</Link></li>
              <li><Link to="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Blog</Link></li>
              <li><Link to="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-slate-900 mb-4">Legal</h4>
            <ul className="space-y-3">
              <li><Link to="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
              <li><Link to="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Terms of Service</Link></li>
              <li><Link to="#" className="text-sm text-slate-600 hover:text-blue-600 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} {user?.businessName || "Progressive POS"}. All rights reserved.
          </p>
          <div className="flex gap-4">
            {/* Social dummy icons */}
            <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-100 flex items-center justify-center cursor-pointer transition-colors text-slate-500 hover:text-blue-600">
              <span className="sr-only">Twitter</span>
              <TwitterIcon />
            </div>
            <div className="w-8 h-8 rounded-full bg-slate-100 hover:bg-blue-100 flex items-center justify-center cursor-pointer transition-colors text-slate-500 hover:text-blue-600">
              <span className="sr-only">GitHub</span>
              <GithubIcon />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
