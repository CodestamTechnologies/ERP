'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PolicySection {
  title: string;
  content: string;
  effectiveDate: string;
  lastUpdated: string;
}

interface EmployeeHandbookData {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
    website: string;
    establishedYear: string;
    mission: string;
    vision: string;
    values: string;
  };
  handbookVersion: string;
  effectiveDate: string;
  lastUpdated: string;
  codeOfConduct: PolicySection;
  workingHours: PolicySection;
  leavePolicy: PolicySection;
  compensationBenefits: PolicySection;
  performanceManagement: PolicySection;
  disciplinaryProcedures: PolicySection;
  healthSafety: PolicySection;
  itPolicy: PolicySection;
  confidentiality: PolicySection;
  equalOpportunity: PolicySection;
  grievanceProcedure: PolicySection;
  terminationPolicy: PolicySection;
  emergencyContacts: string;
  hrContactInfo: string;
  acknowledgment: string;
}

interface TemplateProps {
  data: EmployeeHandbookData;
  companyLogo: string;
  formatDate: (dateString: string) => string;
}

const POLICY_SECTIONS = [
  { key: 'codeOfConduct', title: 'Code of Conduct' },
  { key: 'workingHours', title: 'Working Hours and Attendance' },
  { key: 'leavePolicy', title: 'Leave Policy' },
  { key: 'compensationBenefits', title: 'Compensation and Benefits' },
  { key: 'performanceManagement', title: 'Performance Management' },
  { key: 'disciplinaryProcedures', title: 'Disciplinary Procedures' },
  { key: 'healthSafety', title: 'Health and Safety' },
  { key: 'itPolicy', title: 'IT and Technology Policy' },
  { key: 'confidentiality', title: 'Confidentiality and Non-Disclosure' },
  { key: 'equalOpportunity', title: 'Equal Opportunity and Anti-Discrimination' },
  { key: 'grievanceProcedure', title: 'Grievance Procedure' },
  { key: 'terminationPolicy', title: 'Termination Policy' }
];

export const ModernHandbookTemplate: React.FC<TemplateProps> = ({ 
  data, 
  companyLogo, 
  formatDate 
}) => (
  <Card className="max-w-4xl mx-auto">
    <CardContent className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-blue-600">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">EMPLOYEE HANDBOOK</h1>
          <h2 className="text-xl font-semibold text-gray-800">{data.company.name}</h2>
          <p className="text-gray-600">{data.company.address}</p>
          <p className="text-gray-600">Phone: {data.company.phone} | Email: {data.company.email}</p>
          <div className="mt-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Version:</strong> {data.handbookVersion} | 
                <strong> Effective Date:</strong> {formatDate(data.effectiveDate)} | 
                <strong> Last Updated:</strong> {formatDate(data.lastUpdated)}
              </p>
            </div>
          </div>
        </div>
        {companyLogo && (
          <div className="flex-shrink-0 ml-6">
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-20 w-auto object-contain"
              style={{ maxWidth: '150px' }}
            />
          </div>
        )}
      </div>

      {/* Company Overview */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About Our Company</h2>
        <div className="space-y-4">
          <div><h3 className="text-lg font-semibold text-gray-700 mb-2">Our Mission</h3><p className="text-gray-600">{data.company.mission}</p></div>
          <div><h3 className="text-lg font-semibold text-gray-700 mb-2">Our Vision</h3><p className="text-gray-600">{data.company.vision}</p></div>
          <div><h3 className="text-lg font-semibold text-gray-700 mb-2">Our Values</h3><p className="text-gray-600">{data.company.values}</p></div>
        </div>
      </div>

      {/* Table of Contents */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Table of Contents</h2>
        <div className="bg-gray-50 p-4 rounded-lg">
          <ol className="list-decimal list-inside space-y-1 text-sm">
            {POLICY_SECTIONS.map((section, index) => (
              <li key={section.key}>{section.title}</li>
            ))}
            <li>Emergency Contacts</li>
            <li>HR Contact Information</li>
            <li>Employee Acknowledgment</li>
          </ol>
        </div>
      </div>

      {/* Policy Sections */}
      {POLICY_SECTIONS.map((section, index) => {
        const sectionData = data[section.key as keyof EmployeeHandbookData] as PolicySection;
        return (
          <div key={section.key} className="mb-8 pb-6 border-b border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold text-gray-800">{index + 1}. {sectionData.title}</h2>
              <div className="text-xs text-gray-500">
                <p>Effective: {formatDate(sectionData.effectiveDate)}</p>
                <p>Updated: {formatDate(sectionData.lastUpdated)}</p>
              </div>
            </div>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {sectionData.content}
            </div>
          </div>
        );
      })}

      {/* Emergency Contacts */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{POLICY_SECTIONS.length + 1}. Emergency Contacts</h2>
        <div className="bg-red-50 p-4 rounded-lg">
          <div className="text-gray-700 whitespace-pre-wrap text-sm">{data.emergencyContacts}</div>
        </div>
      </div>

      {/* HR Contact Information */}
      <div className="mb-8 pb-6 border-b border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{POLICY_SECTIONS.length + 2}. HR Contact Information</h2>
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-gray-700 whitespace-pre-wrap text-sm">{data.hrContactInfo}</div>
        </div>
      </div>

      {/* Employee Acknowledgment */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">{POLICY_SECTIONS.length + 3}. Employee Acknowledgment</h2>
        <div className="bg-yellow-50 p-6 rounded-lg border-2 border-yellow-200">
          <div className="text-gray-700 whitespace-pre-wrap text-sm">{data.acknowledgment}</div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-500 mt-12 pt-6 border-t">
        <p>This Employee Handbook is the property of {data.company.name}</p>
        <p>© {new Date().getFullYear()} {data.company.name}. All rights reserved.</p>
        <p>Version {data.handbookVersion} - Effective {formatDate(data.effectiveDate)}</p>
      </div>
    </CardContent>
  </Card>
);

export const CorporateHandbookTemplate: React.FC<TemplateProps> = ({ 
  data, 
  companyLogo, 
  formatDate 
}) => (
  <Card className="max-w-4xl mx-auto">
    <CardContent className="p-8">
      {/* Corporate Header */}
      <div className="bg-gray-900 text-white p-6 -m-8 mb-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-6">
              {companyLogo ? (
                <img 
                  src={companyLogo} 
                  alt="Company Logo" 
                  className="h-16 w-auto object-contain bg-white p-2 rounded"
                  style={{ maxWidth: '120px' }}
                />
              ) : (
                <div className="h-16 w-24 bg-white border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs rounded">
                  Logo
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-2">{data.company.name}</h1>
              <div className="text-gray-300 text-sm">Employee Handbook</div>
            </div>
          </div>
          <div className="text-right text-sm text-gray-300">
            <div>VERSION {data.handbookVersion}</div>
            <div className="font-semibold text-white">{formatDate(data.effectiveDate)}</div>
          </div>
        </div>
      </div>

      {/* Document Information */}
      <div className="mb-8 bg-gray-50 p-6 rounded">
        <h3 className="font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">DOCUMENT INFORMATION</h3>
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            <tr>
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold w-1/3">Document Title</td>
              <td className="border border-gray-300 p-3">Employee Handbook</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Version</td>
              <td className="border border-gray-300 p-3">{data.handbookVersion}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Effective Date</td>
              <td className="border border-gray-300 p-3">{formatDate(data.effectiveDate)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Last Updated</td>
              <td className="border border-gray-300 p-3">{formatDate(data.lastUpdated)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Approved By</td>
              <td className="border border-gray-300 p-3">Human Resources Department</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Corporate Overview */}
      <div className="mb-8">
        <h2 className="font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">CORPORATE OVERVIEW</h2>
        <div className="space-y-6">
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Mission Statement</h3>
            <p className="text-gray-700 text-sm">{data.company.mission}</p>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Vision Statement</h3>
            <p className="text-gray-700 text-sm">{data.company.vision}</p>
          </div>
          <div className="border border-gray-200 rounded p-4">
            <h3 className="font-semibold text-gray-800 mb-2">Core Values</h3>
            <p className="text-gray-700 text-sm">{data.company.values}</p>
          </div>
        </div>
      </div>

      {/* Policy Index */}
      <div className="mb-8">
        <h2 className="font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">POLICY INDEX</h2>
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-3 text-left">Section</th>
              <th className="border border-gray-300 p-3 text-left">Policy Title</th>
              <th className="border border-gray-300 p-3 text-center">Effective Date</th>
              <th className="border border-gray-300 p-3 text-center">Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {POLICY_SECTIONS.map((section, index) => {
              const sectionData = data[section.key as keyof EmployeeHandbookData] as PolicySection;
              return (
                <tr key={section.key}>
                  <td className="border border-gray-300 p-3 font-semibold">{index + 1}</td>
                  <td className="border border-gray-300 p-3">{sectionData.title}</td>
                  <td className="border border-gray-300 p-3 text-center text-sm">{formatDate(sectionData.effectiveDate)}</td>
                  <td className="border border-gray-300 p-3 text-center text-sm">{formatDate(sectionData.lastUpdated)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Corporate Policies */}
      {POLICY_SECTIONS.map((section, index) => {
        const sectionData = data[section.key as keyof EmployeeHandbookData] as PolicySection;
        return (
          <div key={section.key} className="mb-8">
            <div className="bg-gray-100 p-4 rounded-t border border-gray-300">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-900">SECTION {index + 1}: {sectionData.title.toUpperCase()}</h2>
                <div className="text-xs text-gray-600">
                  <div>Effective: {formatDate(sectionData.effectiveDate)}</div>
                  <div>Updated: {formatDate(sectionData.lastUpdated)}</div>
                </div>
              </div>
            </div>
            <div className="border-l border-r border-b border-gray-300 p-6 rounded-b">
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed text-sm">
                {sectionData.content}
              </div>
            </div>
          </div>
        );
      })}

      {/* Corporate Contacts */}
      <div className="mb-8">
        <h2 className="font-bold text-gray-900 mb-4 bg-red-100 p-3 rounded">EMERGENCY CONTACTS</h2>
        <div className="border border-red-300 p-4 rounded bg-red-50">
          <div className="text-gray-700 whitespace-pre-wrap text-sm font-mono">{data.emergencyContacts}</div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="font-bold text-gray-900 mb-4 bg-blue-100 p-3 rounded">HUMAN RESOURCES CONTACT</h2>
        <div className="border border-blue-300 p-4 rounded bg-blue-50">
          <div className="text-gray-700 whitespace-pre-wrap text-sm">{data.hrContactInfo}</div>
        </div>
      </div>

      {/* Corporate Acknowledgment */}
      <div className="mb-8">
        <h2 className="font-bold text-gray-900 mb-4 bg-yellow-100 p-3 rounded">EMPLOYEE ACKNOWLEDGMENT FORM</h2>
        <div className="border-2 border-yellow-400 p-6 rounded bg-yellow-50">
          <div className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">{data.acknowledgment}</div>
        </div>
      </div>

      {/* Corporate Footer */}
      <div className="mt-12 pt-6 border-t border-gray-300 bg-gray-50 -mx-8 px-8 py-6">
        <div className="text-center text-xs text-gray-500">
          <p><strong>{data.company.name} - Employee Handbook</strong></p>
          <p>{data.company.address}</p>
          <p className="mt-2">This document is confidential and proprietary. Version {data.handbookVersion} - {formatDate(data.effectiveDate)}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const StartupHandbookTemplate: React.FC<TemplateProps> = ({ 
  data, 
  companyLogo, 
  formatDate 
}) => (
  <Card className="max-w-4xl mx-auto">
    <CardContent className="p-8" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Startup Header */}
      <div className="text-center mb-12 pb-8 border-b-2 border-gradient-to-r from-purple-400 to-pink-400">
        <div className="mb-6">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-20 w-auto object-contain mx-auto"
              style={{ maxWidth: '150px' }}
            />
          ) : (
            <div className="h-20 w-32 border-2 border-dashed border-purple-300 flex items-center justify-center text-purple-400 text-xs mx-auto rounded-lg">
              Company Logo
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
          {data.company.name}
        </h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Team Handbook</h2>
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
          <p className="text-purple-800 font-medium">
            Welcome to our team! This handbook is your guide to our culture, values, and how we work together.
          </p>
          <div className="mt-4 text-sm text-purple-600">
            Version {data.handbookVersion} • Updated {formatDate(data.lastUpdated)}
          </div>
        </div>
      </div>

      {/* Startup Culture */}
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-3xl mr-3">🚀</span>
          Our Culture & Values
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-3 flex items-center">
              <span className="text-2xl mr-2">🎯</span>
              Mission
            </h3>
            <p className="text-blue-700 text-sm">{data.company.mission}</p>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
            <h3 className="text-lg font-bold text-green-800 mb-3 flex items-center">
              <span className="text-2xl mr-2">🌟</span>
              Vision
            </h3>
            <p className="text-green-700 text-sm">{data.company.vision}</p>
          </div>
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
            <h3 className="text-lg font-bold text-purple-800 mb-3 flex items-center">
              <span className="text-2xl mr-2">💎</span>
              Values
            </h3>
            <p className="text-purple-700 text-sm">{data.company.values}</p>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-2xl mr-3">📋</span>
          Quick Navigation
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {POLICY_SECTIONS.slice(0, 8).map((section, index) => (
            <div key={section.key} className="bg-white border-2 border-gray-200 hover:border-purple-300 p-4 rounded-lg text-center transition-colors">
              <div className="text-2xl mb-2">
                {index === 0 ? '⚖️' : index === 1 ? '⏰' : index === 2 ? '🏖️' : index === 3 ? '💰' : 
                 index === 4 ? '📈' : index === 5 ? '⚠️' : index === 6 ? '🛡️' : '💻'}
              </div>
              <div className="text-sm font-semibold text-gray-700">{section.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Startup Policies */}
      {POLICY_SECTIONS.map((section, index) => {
        const sectionData = data[section.key as keyof EmployeeHandbookData] as PolicySection;
        const colors = [
          'blue', 'green', 'purple', 'orange', 'pink', 'indigo', 'teal', 'red', 
          'yellow', 'cyan', 'emerald', 'violet'
        ];
        const color = colors[index % colors.length];
        
        return (
          <div key={section.key} className="mb-10">
            <div className={`bg-gradient-to-r from-${color}-500 to-${color}-600 text-white p-6 rounded-t-xl`}>
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold flex items-center">
                  <span className="text-2xl mr-3">
                    {index === 0 ? '⚖️' : index === 1 ? '⏰' : index === 2 ? '🏖️' : index === 3 ? '💰' : 
                     index === 4 ? '📈' : index === 5 ? '⚠️' : index === 6 ? '🛡️' : index === 7 ? '💻' :
                     index === 8 ? '🤐' : index === 9 ? '🤝' : index === 10 ? '📢' : '👋'}
                  </span>
                  {sectionData.title}
                </h2>
                <div className="text-right text-sm opacity-90">
                  <div>Updated: {formatDate(sectionData.lastUpdated)}</div>
                </div>
              </div>
            </div>
            <div className={`bg-${color}-50 border-l-4 border-r-4 border-b-4 border-${color}-200 p-6 rounded-b-xl`}>
              <div className={`text-${color}-800 whitespace-pre-wrap leading-relaxed`}>
                {sectionData.content}
              </div>
            </div>
          </div>
        );
      })}

      {/* Startup Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-xl border-2 border-red-200">
          <h2 className="text-xl font-bold text-red-800 mb-4 flex items-center">
            <span className="text-2xl mr-3">🚨</span>
            Emergency Contacts
          </h2>
          <div className="text-red-700 whitespace-pre-wrap text-sm font-mono bg-white p-4 rounded-lg">
            {data.emergencyContacts}
          </div>
        </div>
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border-2 border-blue-200">
          <h2 className="text-xl font-bold text-blue-800 mb-4 flex items-center">
            <span className="text-2xl mr-3">👥</span>
            HR Team
          </h2>
          <div className="text-blue-700 whitespace-pre-wrap text-sm bg-white p-4 rounded-lg">
            {data.hrContactInfo}
          </div>
        </div>
      </div>

      {/* Startup Acknowledgment */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="text-2xl mr-3">✍️</span>
          Let's Make It Official!
        </h2>
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-8 rounded-xl border-2 border-yellow-300">
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {data.acknowledgment}
          </div>
        </div>
      </div>

      {/* Startup Footer */}
      <div className="text-center mt-16 pt-8 border-t-2 border-gradient-to-r from-purple-200 to-pink-200">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-6 rounded-xl">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Welcome to the Team! 🎉</h3>
          <p className="text-gray-600 text-sm mb-4">
            This handbook is a living document that grows with us. Have suggestions? We'd love to hear them!
          </p>
          <div className="text-xs text-gray-500">
            <p>{data.company.name} • Version {data.handbookVersion}</p>
            <p>Made with ❤️ for our amazing team</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const ComprehensiveHandbookTemplate: React.FC<TemplateProps> = ({ 
  data, 
  companyLogo, 
  formatDate 
}) => (
  <Card className="max-w-4xl mx-auto">
    <CardContent className="p-10" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Comprehensive Header */}
      <div className="text-center mb-12 pb-8 border-b-4 border-gray-800">
        <div className="mb-6">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-20 w-auto object-contain mx-auto"
              style={{ maxWidth: '140px' }}
            />
          ) : (
            <div className="h-20 w-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs mx-auto">
              Company Logo
            </div>
          )}
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4 uppercase tracking-wide">
          {data.company.name}
        </h1>
        <div className="w-32 h-1 bg-gray-800 mx-auto mb-6"></div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 uppercase tracking-wider">
          COMPREHENSIVE EMPLOYEE HANDBOOK
        </h2>
        <div className="bg-gray-100 p-6 rounded-lg max-w-2xl mx-auto">
          <p className="text-gray-700 text-sm leading-relaxed">
            This comprehensive handbook serves as your complete guide to employment policies, 
            procedures, benefits, and organizational culture at {data.company.name}.
          </p>
          <div className="mt-4 pt-4 border-t border-gray-300 text-xs text-gray-600">
            <strong>Document Version:</strong> {data.handbookVersion} | 
            <strong> Effective:</strong> {formatDate(data.effectiveDate)} | 
            <strong> Last Revision:</strong> {formatDate(data.lastUpdated)}
          </div>
        </div>
      </div>

      {/* Executive Summary */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-300">EXECUTIVE SUMMARY</h2>
        <div className="bg-gray-50 p-8 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Company Profile</h3>
              <div className="space-y-3 text-sm">
                <div><strong>Established:</strong> {data.company.establishedYear}</div>
                <div><strong>Website:</strong> {data.company.website}</div>
                <div><strong>Headquarters:</strong> {data.company.address}</div>
                <div><strong>Contact:</strong> {data.company.phone} | {data.company.email}</div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Handbook Information</h3>
              <div className="space-y-3 text-sm">
                <div><strong>Version:</strong> {data.handbookVersion}</div>
                <div><strong>Effective Date:</strong> {formatDate(data.effectiveDate)}</div>
                <div><strong>Last Updated:</strong> {formatDate(data.lastUpdated)}</div>
                <div><strong>Next Review:</strong> {formatDate(new Date(new Date(data.lastUpdated).getTime() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Organizational Philosophy */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-300">ORGANIZATIONAL PHILOSOPHY</h2>
        <div className="space-y-8">
          <div className="border-l-4 border-blue-500 pl-6">
            <h3 className="text-xl font-bold text-blue-800 mb-3">Mission Statement</h3>
            <p className="text-gray-700 leading-relaxed italic text-lg">{data.company.mission}</p>
          </div>
          <div className="border-l-4 border-green-500 pl-6">
            <h3 className="text-xl font-bold text-green-800 mb-3">Vision Statement</h3>
            <p className="text-gray-700 leading-relaxed italic text-lg">{data.company.vision}</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-6">
            <h3 className="text-xl font-bold text-purple-800 mb-3">Core Values</h3>
            <p className="text-gray-700 leading-relaxed italic text-lg">{data.company.values}</p>
          </div>
        </div>
      </div>

      {/* Comprehensive Table of Contents */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-300">TABLE OF CONTENTS</h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-gray-800 mb-3">PART I: EMPLOYMENT POLICIES</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {POLICY_SECTIONS.slice(0, 6).map((section, index) => (
                  <li key={section.key} className="text-gray-700">{section.title}</li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-3">PART II: OPERATIONAL GUIDELINES</h3>
              <ol className="list-decimal list-inside space-y-1 text-sm" start={7}>
                {POLICY_SECTIONS.slice(6).map((section, index) => (
                  <li key={section.key} className="text-gray-700">{section.title}</li>
                ))}
              </ol>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-300">
            <h3 className="font-bold text-gray-800 mb-3">APPENDICES</h3>
            <ul className="list-disc list-inside space-y-1 text-sm text-gray-700">
              <li>Emergency Contact Directory</li>
              <li>Human Resources Contact Information</li>
              <li>Employee Acknowledgment Form</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Comprehensive Policies */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-300">EMPLOYMENT POLICIES & PROCEDURES</h2>
        {POLICY_SECTIONS.map((section, index) => {
          const sectionData = data[section.key as keyof EmployeeHandbookData] as PolicySection;
          const isPartTwo = index >= 6;
          
          return (
            <div key={section.key} className="mb-10">
              {index === 6 && (
                <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-300 mt-12">OPERATIONAL GUIDELINES</h2>
              )}
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <div className={`${isPartTwo ? 'bg-blue-100 border-blue-300' : 'bg-gray-100 border-gray-300'} p-6 border-b`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        SECTION {index + 1}: {sectionData.title.toUpperCase()}
                      </h3>
                      <div className="text-sm text-gray-600">
                        Policy Classification: {isPartTwo ? 'Operational Guideline' : 'Employment Policy'}
                      </div>
                    </div>
                    <div className="text-right text-xs text-gray-600 bg-white p-3 rounded border">
                      <div><strong>Effective:</strong> {formatDate(sectionData.effectiveDate)}</div>
                      <div><strong>Last Updated:</strong> {formatDate(sectionData.lastUpdated)}</div>
                      <div><strong>Review Cycle:</strong> Annual</div>
                    </div>
                  </div>
                </div>
                <div className="p-8">
                  <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {sectionData.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Comprehensive Appendices */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 pb-2 border-b-2 border-gray-300">APPENDICES</h2>
        
        <div className="space-y-8">
          <div className="border border-red-300 rounded-lg overflow-hidden">
            <div className="bg-red-100 p-4 border-b border-red-300">
              <h3 className="text-lg font-bold text-red-800">APPENDIX A: EMERGENCY CONTACT DIRECTORY</h3>
            </div>
            <div className="p-6 bg-red-50">
              <div className="text-red-800 whitespace-pre-wrap text-sm font-mono leading-relaxed">
                {data.emergencyContacts}
              </div>
            </div>
          </div>

          <div className="border border-blue-300 rounded-lg overflow-hidden">
            <div className="bg-blue-100 p-4 border-b border-blue-300">
              <h3 className="text-lg font-bold text-blue-800">APPENDIX B: HUMAN RESOURCES CONTACT INFORMATION</h3>
            </div>
            <div className="p-6 bg-blue-50">
              <div className="text-blue-800 whitespace-pre-wrap text-sm leading-relaxed">
                {data.hrContactInfo}
              </div>
            </div>
          </div>

          <div className="border border-yellow-300 rounded-lg overflow-hidden">
            <div className="bg-yellow-100 p-4 border-b border-yellow-300">
              <h3 className="text-lg font-bold text-yellow-800">APPENDIX C: EMPLOYEE ACKNOWLEDGMENT FORM</h3>
            </div>
            <div className="p-8 bg-yellow-50">
              <div className="text-yellow-800 whitespace-pre-wrap leading-relaxed">
                {data.acknowledgment}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Comprehensive Footer */}
      <div className="mt-16 pt-8 border-t-4 border-gray-800">
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-4">DOCUMENT CONTROL INFORMATION</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-700">
            <div>
              <strong>Document Owner:</strong><br />
              Human Resources Department<br />
              {data.company.name}
            </div>
            <div>
              <strong>Version Control:</strong><br />
              Version {data.handbookVersion}<br />
              Effective {formatDate(data.effectiveDate)}
            </div>
            <div>
              <strong>Distribution:</strong><br />
              All Employees<br />
              Confidential Document
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-300 text-xs text-gray-500">
            <p>This handbook supersedes all previous versions and is subject to change at the discretion of management.</p>
            <p className="mt-2">© {new Date().getFullYear()} {data.company.name}. All rights reserved. Confidential and Proprietary.</p>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const handbookTemplateOptions = [
  { value: 'modern', label: 'Modern Handbook', description: 'Clean and contemporary employee handbook design' },
  { value: 'corporate', label: 'Corporate Handbook', description: 'Professional corporate handbook format' },
  { value: 'startup', label: 'Startup Handbook', description: 'Modern startup-style handbook with vibrant design' },
  { value: 'comprehensive', label: 'Comprehensive Handbook', description: 'Detailed policy handbook with formal structure' }
];