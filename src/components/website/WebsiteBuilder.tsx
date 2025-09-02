'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Rocket, Palette, Code, Layers, Search, Smartphone, BarChart3,
  Star, ArrowRight, CheckCircle, Globe, Zap, Shield, Monitor,
  Play, Download, Eye, Settings, Plus, X
} from 'lucide-react';

// Define interfaces for type safety
interface WebsiteData {
  name: string;
  domain: string;
  template: string;
  templateName?: string;
  category: string;
  features: string[];
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

interface WebsiteBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateWebsite: (websiteData: WebsiteData) => void;
}

const WebsiteBuilder = ({ isOpen, onClose, onCreateWebsite }: WebsiteBuilderProps) => {
  const [activeStep, setActiveStep] = useState(0);
  const [selectedTemplate, setSelectedTemplate] = useState(0);
  const [websiteData, setWebsiteData] = useState({
    name: '',
    domain: '',
    template: '',
    category: '',
    features: [] as string[],
    colors: {
      primary: '#3B82F6',
      secondary: '#10B981',
      accent: '#F59E0B'
    }
  });

  const steps = [
    { title: 'Template', desc: 'Choose your design' },
    { title: 'Customize', desc: 'Make it yours' },
    { title: 'Features', desc: 'Add functionality' },
    { title: 'Deploy', desc: 'Launch your site' }
  ];

  const templates = [
    { 
      id: 'business-pro',
      name: 'Business Pro', 
      category: 'Corporate', 
      rating: 4.9,
      preview: '/api/placeholder/400/300',
      features: ['Contact Forms', 'Team Pages', 'Service Showcase'],
      color: 'blue'
    },
    { 
      id: 'ecommerce-plus',
      name: 'E-commerce Plus', 
      category: 'Online Store', 
      rating: 4.8,
      preview: '/api/placeholder/400/300',
      features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway'],
      color: 'emerald'
    },
    { 
      id: 'portfolio-modern',
      name: 'Portfolio Modern', 
      category: 'Creative', 
      rating: 4.7,
      preview: '/api/placeholder/400/300',
      features: ['Gallery', 'Blog', 'Contact Form'],
      color: 'purple'
    },
    { 
      id: 'restaurant-deluxe',
      name: 'Restaurant Deluxe', 
      category: 'Food & Dining', 
      rating: 4.9,
      preview: '/api/placeholder/400/300',
      features: ['Menu Display', 'Reservations', 'Online Ordering'],
      color: 'orange'
    }
  ];

  const builderFeatures = [
    { 
      icon: <Palette className="w-5 h-5" />, 
      title: 'Visual Design System', 
      desc: 'Drag & drop with smart components',
      included: true
    },
    { 
      icon: <Code className="w-5 h-5" />, 
      title: 'Custom Code Integration', 
      desc: 'Add HTML, CSS, and JavaScript',
      included: true
    },
    { 
      icon: <Layers className="w-5 h-5" />, 
      title: 'Advanced Layouts', 
      desc: 'Grid, flexbox, and responsive design',
      included: true
    },
    { 
      icon: <Search className="w-5 h-5" />, 
      title: 'SEO Optimization', 
      desc: 'Built-in SEO tools and analytics',
      included: true
    },
    { 
      icon: <Smartphone className="w-5 h-5" />, 
      title: 'Mobile-First Design', 
      desc: 'Optimized for all screen sizes',
      included: true
    },
    { 
      icon: <BarChart3 className="w-5 h-5" />, 
      title: 'Analytics Dashboard', 
      desc: 'Real-time performance insights',
      included: false
    }
  ];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    }
  };

  const handlePrevious = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  const handleCreateWebsite = () => {
    const selectedTemplateData = templates[selectedTemplate];
    const finalWebsiteData = {
      ...websiteData,
      template: selectedTemplateData.id,
      templateName: selectedTemplateData.name,
      category: selectedTemplateData.category
    };
    
    onCreateWebsite(finalWebsiteData);
    onClose();
    
    // Simulate website creation
    setTimeout(() => {
      alert(`🎉 Website "${websiteData.name}" created successfully!\n\nTemplate: ${selectedTemplateData.name}\nDomain: ${websiteData.domain}\n\nYour website is being deployed...`);
    }, 500);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0: // Template Selection
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Template</h3>
              <p className="text-gray-600">Select a design that matches your vision</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {templates.map((template, index) => (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                    selectedTemplate === index
                      ? 'border-blue-300 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => setSelectedTemplate(index)}
                >
                  <div className="aspect-video bg-gray-100 rounded-lg mb-3 overflow-hidden">
                    <div className={`w-full h-full bg-gradient-to-br ${
                      template.color === 'blue' ? 'from-blue-400 to-blue-600' :
                      template.color === 'emerald' ? 'from-emerald-400 to-emerald-600' :
                      template.color === 'purple' ? 'from-purple-400 to-purple-600' :
                      'from-orange-400 to-orange-600'
                    } flex items-center justify-center`}>
                      <Monitor className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold text-gray-900">{template.name}</h4>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{template.rating}</span>
                      </div>
                    </div>
                    
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                    
                    <div className="flex flex-wrap gap-1">
                      {template.features.slice(0, 2).map((feature, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                      {template.features.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{template.features.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {selectedTemplate === index && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                    >
                      <CheckCircle className="w-4 h-4 text-white" />
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 1: // Customize
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Customize Your Website</h3>
              <p className="text-gray-600">Add your personal touch</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website Name
                  </label>
                  <Input
                    placeholder="My Awesome Website"
                    value={websiteData.name}
                    onChange={(e) => setWebsiteData({...websiteData, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Domain Name
                  </label>
                  <div className="flex">
                    <Input
                      placeholder="mywebsite"
                      value={websiteData.domain}
                      onChange={(e) => setWebsiteData({...websiteData, domain: e.target.value})}
                      className="rounded-r-none"
                    />
                    <div className="px-3 py-2 bg-gray-100 border border-l-0 rounded-r-md text-sm text-gray-600">
                      .codestam.com
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Color Scheme
                  </label>
                  <div className="flex space-x-2">
                    {['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'].map((color) => (
                      <button
                        key={color}
                        className={`w-8 h-8 rounded-full border-2 ${
                          websiteData.colors.primary === color ? 'border-gray-400' : 'border-gray-200'
                        }`}
                        style={{ backgroundColor: color }}
                        onClick={() => setWebsiteData({
                          ...websiteData,
                          colors: { ...websiteData.colors, primary: color }
                        })}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-900 mb-2">Preview</h4>
                  <div className="aspect-video bg-white rounded border flex items-center justify-center">
                    <div className="text-center">
                      <div 
                        className="w-16 h-16 rounded-full mx-auto mb-2"
                        style={{ backgroundColor: websiteData.colors.primary }}
                      />
                      <p className="font-medium">{websiteData.name || 'Your Website'}</p>
                      <p className="text-sm text-gray-600">{websiteData.domain || 'domain'}.codestam.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Features
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Features</h3>
              <p className="text-gray-600">Select the functionality you need</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {builderFeatures.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border transition-all duration-200 ${
                    feature.included 
                      ? 'border-green-200 bg-green-50' 
                      : 'border-gray-200 bg-gray-50'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${
                      feature.included ? 'bg-green-100' : 'bg-gray-100'
                    }`}>
                      <div className={feature.included ? 'text-green-600' : 'text-gray-600'}>
                        {feature.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-gray-900 text-sm">{feature.title}</h5>
                        {feature.included ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <Badge variant="outline" className="text-xs">Pro</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-1">{feature.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      case 3: // Deploy
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Launch!</h3>
              <p className="text-gray-600">Your website is ready to go live</p>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Rocket className="w-5 h-5 mr-2 text-blue-600" />
                  Website Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Name</label>
                    <p className="font-medium">{websiteData.name || 'Untitled Website'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Domain</label>
                    <p className="font-medium">{websiteData.domain || 'domain'}.codestam.com</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Template</label>
                    <p className="font-medium">{templates[selectedTemplate].name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Category</label>
                    <p className="font-medium">{templates[selectedTemplate].category}</p>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <h4 className="font-medium text-gray-900 mb-2">Included Features</h4>
                  <div className="flex flex-wrap gap-2">
                    {builderFeatures.filter(f => f.included).map((feature, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {feature.title}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Rocket className="w-5 h-5 text-blue-600" />
            <span>Website Builder</span>
          </DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                index <= activeStep 
                  ? 'border-blue-500 bg-blue-500 text-white' 
                  : 'border-gray-300 text-gray-400'
              }`}>
                {index < activeStep ? (
                  <CheckCircle className="w-4 h-4" />
                ) : (
                  <span className="text-sm font-medium">{index + 1}</span>
                )}
              </div>
              <div className="ml-2">
                <p className={`text-sm font-medium ${
                  index <= activeStep ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
                <p className="text-xs text-gray-500">{step.desc}</p>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-12 h-0.5 mx-4 ${
                  index < activeStep ? 'bg-blue-500' : 'bg-gray-300'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={activeStep === 0}
          >
            Previous
          </Button>
          
          <div className="flex space-x-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            {activeStep === steps.length - 1 ? (
              <Button 
                onClick={handleCreateWebsite}
                className="bg-blue-600 hover:bg-blue-700"
                disabled={!websiteData.name || !websiteData.domain}
              >
                <Rocket className="w-4 h-4 mr-2" />
                Create Website
              </Button>
            ) : (
              <Button onClick={handleNext}>
                Next
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WebsiteBuilder;