'use client';

import React from 'react';
import { OfferLetterData } from '@/types/offerLetter';

interface TemplateProps {
  data: OfferLetterData;
  companyLogo: string;
  formatCurrency: (amount: string, currency: string) => string;
  formatDate: (dateString: string) => string;
}

export const ModernTemplate: React.FC<TemplateProps> = ({ data, companyLogo, formatCurrency, formatDate }) => (
  <div className="bg-white p-12 shadow-sm max-w-4xl mx-auto border" style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', lineHeight: '1.6' }}>
    {/* Company Header */}
    <div className="flex justify-between items-start mb-12 pb-8 border-b border-gray-300">
      {/* Company Logo */}
      <div className="flex-shrink-0">
        {companyLogo ? (
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            className="h-20 w-auto object-contain"
            style={{ maxWidth: '150px' }}
          />
        ) : (
          <div className="h-20 w-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
            Company Logo
          </div>
        )}
      </div>
      
      {/* Company Details */}
      <div className="text-right flex-1 ml-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-3 uppercase tracking-wide">
          {data.company.name || 'Codestam Technologies Pvt Ltd'}
        </h1>
        <div className="text-gray-700 text-sm leading-relaxed">
          {data.company.address || '123 Tech Park, Sector 5'}, {data.company.city || 'Mumbai'}, {data.company.state || 'Maharashtra'} {data.company.zip || '400001'}<br />
          Phone: {data.company.phone || '+91 98765 43210'} | Email: {data.company.email || 'hr@codestam.com'}
          {(data.company.website || 'www.codestam.com') && <span> | Website: {data.company.website || 'www.codestam.com'}</span>}
        </div>
      </div>
    </div>

    {/* Letter Header */}
    <div className="mb-10">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 uppercase tracking-wide">OFFER OF EMPLOYMENT</h2>
          <div className="text-gray-700">Date: {formatDate(data.letterDate)}</div>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-600 uppercase tracking-wide">Position Type</div>
          <div className="font-semibold text-gray-900">{data.job.employmentType}</div>
        </div>
      </div>

      {/* Candidate Information */}
      <div className="mb-8">
        <div className="font-semibold text-lg text-gray-900 mb-2">{data.candidate.firstName} {data.candidate.lastName}</div>
        <div className="text-gray-700 text-sm leading-relaxed">
          {data.candidate.address}<br />
          {data.candidate.city}, {data.candidate.state} {data.candidate.zip}<br />
          Email: {data.candidate.email} | Phone: {data.candidate.phone}
        </div>
      </div>
    </div>

    {/* Letter Body */}
    <div className="space-y-6 text-gray-800 leading-relaxed mb-12">
      <p>Dear {data.candidate.firstName},</p>
      
      <p>We are pleased to extend this offer of employment to you for the position of <strong>{data.job.title}</strong> in our {data.job.department} department at {data.company.name}.</p>
      
      <p>We believe that your skills, experience, and enthusiasm make you an excellent fit for our team, and we are excited about the contributions you will make to our organization.</p>

      {/* Position Details */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">POSITION DETAILS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div><strong>Job Title:</strong> {data.job.title}</div>
          <div><strong>Department:</strong> {data.job.department}</div>
          <div><strong>Employment Type:</strong> {data.job.employmentType}</div>
          <div><strong>Reporting Manager:</strong> {data.job.reportingManager}</div>
          <div><strong>Start Date:</strong> {formatDate(data.job.startDate)}</div>
          <div><strong>Work Location:</strong> {data.job.workLocation}</div>
          <div className="md:col-span-2"><strong>Work Schedule:</strong> {data.job.workSchedule}</div>
        </div>
      </div>

      {/* Compensation Package */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">COMPENSATION PACKAGE</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div><strong>Base Salary:</strong> {formatCurrency(data.compensation.baseSalary, data.compensation.currency)} {data.compensation.payFrequency.toLowerCase()}</div>
          {data.compensation.bonus && <div><strong>Performance Bonus:</strong> {data.compensation.bonus}</div>}
          {data.compensation.stockOptions && <div><strong>Stock Options:</strong> {data.compensation.stockOptions}</div>}
          {data.compensation.otherCompensation && <div className="md:col-span-2"><strong>Other Compensation:</strong> {data.compensation.otherCompensation}</div>}
        </div>
      </div>

      {/* Benefits Package */}
      {(Object.values(data.benefits).some(benefit => benefit) || data.benefits.paidTimeOff || data.benefits.sickLeave || data.benefits.maternityPaternityLeave || data.benefits.otherBenefits) && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">BENEFITS PACKAGE</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
            {Object.entries({
              healthInsurance: 'Health Insurance', dentalInsurance: 'Dental Insurance', visionInsurance: 'Vision Insurance',
              lifeInsurance: 'Life Insurance', retirementPlan: 'Retirement Plan', professionalDevelopment: 'Professional Development',
              gymMembership: 'Gym Membership', flexibleWorkArrangements: 'Flexible Work Arrangements'
            }).filter(([key]) => data.benefits[key as keyof typeof data.benefits]).map(([, label]) => (
              <div key={label}><strong>{label}:</strong> Included</div>
            ))}
            {data.benefits.paidTimeOff && <div><strong>Paid Time Off:</strong> {data.benefits.paidTimeOff}</div>}
            {data.benefits.sickLeave && <div><strong>Sick Leave:</strong> {data.benefits.sickLeave}</div>}
            {data.benefits.maternityPaternityLeave && <div className="md:col-span-2"><strong>Maternity/Paternity Leave:</strong> {data.benefits.maternityPaternityLeave}</div>}
            {data.benefits.otherBenefits && <div className="md:col-span-2"><strong>Other Benefits:</strong> {data.benefits.otherBenefits}</div>}
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      <div className="mt-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b border-gray-200">TERMS AND CONDITIONS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
          <div><strong>Probation Period:</strong> {data.terms.probationPeriod}</div>
          <div><strong>Notice Period:</strong> {data.terms.noticePeriod}</div>
          {Object.entries({
            confidentialityAgreement: 'Confidentiality Agreement', nonCompeteClause: 'Non-Compete Clause',
            nonSolicitationClause: 'Non-Solicitation Clause', backgroundCheck: 'Background Check Required',
            drugTest: 'Drug Test Required'
          }).filter(([key]) => data.terms[key as keyof typeof data.terms]).map(([, label]) => (
            <div key={label}><strong>{label}:</strong> Required</div>
          ))}
          {data.terms.additionalTerms && <div className="md:col-span-2"><strong>Additional Terms:</strong> {data.terms.additionalTerms}</div>}
        </div>
      </div>

      {/* Offer Acceptance */}
      <div className="mt-8 p-6 border border-gray-300 bg-gray-50">
        <h3 className="text-lg font-bold text-gray-900 mb-3">OFFER ACCEPTANCE</h3>
        <p className="text-sm mb-3">This offer is valid until <strong>{formatDate(data.terms.offerValidUntil)}</strong>. Please confirm your acceptance by signing and returning this letter by the specified date.</p>
        <p className="text-sm">If you accept this offer, please sign below and return this letter to us. We look forward to welcoming you to the {data.company.name} team!</p>
      </div>

      <p>Should you have any questions about this offer or need clarification on any terms, please don't hesitate to contact our HR department.</p>
      <p>We are excited about the possibility of you joining our team and look forward to your positive response.</p>
      <p className="mt-6">Sincerely,</p>
    </div>

    {/* Signature Section */}
    <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
      <div>
        <div className="border-b-2 border-gray-800 w-64 mb-3"></div>
        <div className="font-semibold text-gray-900">{data.signerName}</div>
        <div className="text-gray-700">{data.signerTitle}</div>
        <div className="text-gray-700">{data.company.name}</div>
        <div className="text-gray-600 text-sm mt-2">Date: {formatDate(data.letterDate)}</div>
      </div>
      <div>
        <div className="border-b-2 border-gray-800 w-64 mb-3"></div>
        <div className="font-semibold text-gray-900">{data.candidate.firstName} {data.candidate.lastName}</div>
        <div className="text-gray-700">Employee Signature</div>
        <div className="text-gray-600 text-sm mt-2">Date: _______________</div>
      </div>
    </div>

    {/* HR Contact Information */}
    {(data.hrContactName || data.hrContactEmail || data.hrContactPhone) && (
      <div className="mt-12 pt-6 border-t border-gray-300">
        <h4 className="font-semibold text-gray-900 mb-3">HR CONTACT INFORMATION</h4>
        <div className="text-sm text-gray-700 space-y-1">
          {data.hrContactName && <div><strong>Contact Person:</strong> {data.hrContactName}</div>}
          {data.hrContactEmail && <div><strong>Email:</strong> {data.hrContactEmail}</div>}
          {data.hrContactPhone && <div><strong>Phone:</strong> {data.hrContactPhone}</div>}
        </div>
      </div>
    )}

    {/* Footer */}
    <div className="mt-12 pt-6 border-t border-gray-300 text-center text-xs text-gray-500">
      <p>This offer letter is confidential and proprietary to {data.company.name}</p>
      <p className="mt-1">Generated on {formatDate(new Date().toISOString().split('T')[0])}</p>
    </div>
  </div>
);

export const ClassicTemplate: React.FC<TemplateProps> = ({ data, companyLogo, formatCurrency, formatDate }) => (
  <div className="bg-white p-12 shadow-sm max-w-4xl mx-auto border" style={{ fontFamily: 'Times New Roman, serif', fontSize: '14px', lineHeight: '1.8' }}>
    {/* Centered Company Header */}
    <div className="text-center mb-12 pb-8 border-b-2 border-gray-800">
      <div className="mb-6">
        {companyLogo ? (
          <img 
            src={companyLogo} 
            alt="Company Logo" 
            className="h-16 w-auto object-contain mx-auto"
            style={{ maxWidth: '120px' }}
          />
        ) : (
          <div className="h-16 w-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs mx-auto">
            Company Logo
          </div>
        )}
      </div>
      <h1 className="text-3xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
        {data.company.name || 'Codestam Technologies Pvt Ltd'}
      </h1>
      <div className="text-gray-700 text-sm leading-relaxed">
        {data.company.address || '123 Tech Park, Sector 5'}, {data.company.city || 'Mumbai'}, {data.company.state || 'Maharashtra'} {data.company.zip || '400001'}<br />
        Phone: {data.company.phone || '+91 98765 43210'} | Email: {data.company.email || 'hr@codestam.com'}
        {(data.company.website || 'www.codestam.com') && <span> | Website: {data.company.website || 'www.codestam.com'}</span>}
      </div>
    </div>

    {/* Letter Title */}
    <div className="text-center mb-10">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">LETTER OF EMPLOYMENT OFFER</h2>
      <div className="text-gray-700 mb-6">Date: {formatDate(data.letterDate)}</div>
    </div>

    {/* Candidate Information */}
    <div className="mb-10 text-left">
      <div className="font-bold text-lg text-gray-900 mb-3">{data.candidate.firstName} {data.candidate.lastName}</div>
      <div className="text-gray-700 text-sm leading-relaxed">
        {data.candidate.address}<br />
        {data.candidate.city}, {data.candidate.state} {data.candidate.zip}<br />
        Email: {data.candidate.email} | Phone: {data.candidate.phone}
      </div>
    </div>

    {/* Letter Body */}
    <div className="space-y-6 text-gray-800 leading-relaxed mb-12 text-justify">
      <p className="text-lg">Dear Mr./Ms. {data.candidate.lastName},</p>
      
      <p>It is with great pleasure that we extend to you this formal offer of employment for the position of <strong>{data.job.title}</strong> within the {data.job.department} department of {data.company.name}.</p>
      
      <p>After careful consideration of your qualifications and experience, we are confident that you will be a valuable addition to our organization and contribute significantly to our continued success.</p>

      {/* Position Details */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-gray-900 mb-6 text-center uppercase tracking-wide border-b border-gray-400 pb-2">POSITION DETAILS</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold">Position Title:</span>
            <span>{data.job.title}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold">Department:</span>
            <span>{data.job.department}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold">Employment Type:</span>
            <span>{data.job.employmentType}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold">Reporting Manager:</span>
            <span>{data.job.reportingManager}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold">Commencement Date:</span>
            <span>{formatDate(data.job.startDate)}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold">Work Location:</span>
            <span>{data.job.workLocation}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Work Schedule:</span>
            <span>{data.job.workSchedule}</span>
          </div>
        </div>
      </div>

      {/* Compensation */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-gray-900 mb-6 text-center uppercase tracking-wide border-b border-gray-400 pb-2">COMPENSATION & REMUNERATION</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold">Base Salary:</span>
            <span>{formatCurrency(data.compensation.baseSalary, data.compensation.currency)} {data.compensation.payFrequency.toLowerCase()}</span>
          </div>
          {data.compensation.bonus && (
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-semibold">Performance Bonus:</span>
              <span>{data.compensation.bonus}</span>
            </div>
          )}
          {data.compensation.stockOptions && (
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="font-semibold">Stock Options:</span>
              <span>{data.compensation.stockOptions}</span>
            </div>
          )}
          {data.compensation.otherCompensation && (
            <div className="flex justify-between">
              <span className="font-semibold">Other Compensation:</span>
              <span>{data.compensation.otherCompensation}</span>
            </div>
          )}
        </div>
      </div>

      {/* Terms */}
      <div className="mt-10">
        <h3 className="text-lg font-bold text-gray-900 mb-6 text-center uppercase tracking-wide border-b border-gray-400 pb-2">TERMS OF EMPLOYMENT</h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold">Probationary Period:</span>
            <span>{data.terms.probationPeriod}</span>
          </div>
          <div className="flex justify-between border-b border-gray-200 pb-2">
            <span className="font-semibold">Notice Period:</span>
            <span>{data.terms.noticePeriod}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold">Offer Valid Until:</span>
            <span>{formatDate(data.terms.offerValidUntil)}</span>
          </div>
        </div>
      </div>

      <p className="mt-8">This offer is contingent upon successful completion of background verification and any other pre-employment requirements as deemed necessary by the company.</p>
      
      <p>We trust that you will find this offer acceptable and look forward to your positive response. Should you require any clarification, please do not hesitate to contact our Human Resources department.</p>
      
      <p>We eagerly anticipate welcoming you to our team and are confident that your association with {data.company.name} will be mutually beneficial and rewarding.</p>
      
      <p className="mt-8">Yours sincerely,</p>
    </div>

    {/* Signature Section */}
    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16">
      <div className="text-center">
        <div className="border-b-2 border-gray-800 w-48 mb-4 mx-auto"></div>
        <div className="font-bold text-gray-900">{data.signerName}</div>
        <div className="text-gray-700 italic">{data.signerTitle}</div>
        <div className="text-gray-700">{data.company.name}</div>
        <div className="text-gray-600 text-sm mt-3">Date: {formatDate(data.letterDate)}</div>
      </div>
      <div className="text-center">
        <div className="border-b-2 border-gray-800 w-48 mb-4 mx-auto"></div>
        <div className="font-bold text-gray-900">{data.candidate.firstName} {data.candidate.lastName}</div>
        <div className="text-gray-700 italic">Employee Signature</div>
        <div className="text-gray-600 text-sm mt-3">Date: _______________</div>
      </div>
    </div>

    {/* Footer */}
    <div className="mt-16 pt-8 border-t-2 border-gray-800 text-center text-xs text-gray-500">
      <p className="italic">This document constitutes a confidential communication between {data.company.name} and the named recipient.</p>
      <p className="mt-2">Document generated on {formatDate(new Date().toISOString().split('T')[0])}</p>
    </div>
  </div>
);

export const ExecutiveTemplate: React.FC<TemplateProps> = ({ data, companyLogo, formatCurrency, formatDate }) => (
  <div className="bg-white p-12 shadow-sm max-w-4xl mx-auto border" style={{ fontFamily: 'Georgia, serif', fontSize: '14px', lineHeight: '1.7' }}>
    {/* Elegant Header */}
    <div className="mb-12 pb-8 border-b-4 border-gray-800">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="mb-4">
            {companyLogo ? (
              <img 
                src={companyLogo} 
                alt="Company Logo" 
                className="h-16 w-auto object-contain"
                style={{ maxWidth: '140px' }}
              />
            ) : (
              <div className="h-16 w-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
                Company Logo
              </div>
            )}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-wide">
            {data.company.name || 'Codestam Technologies Pvt Ltd'}
          </h1>
          <div className="w-24 h-1 bg-gray-800 mb-4"></div>
        </div>
        <div className="text-right text-sm text-gray-600 leading-relaxed">
          {data.company.address || '123 Tech Park, Sector 5'}<br />
          {data.company.city || 'Mumbai'}, {data.company.state || 'Maharashtra'} {data.company.zip || '400001'}<br />
          <div className="mt-2">
            <strong>T:</strong> {data.company.phone || '+91 98765 43210'}<br />
            <strong>E:</strong> {data.company.email || 'hr@codestam.com'}<br />
            {(data.company.website || 'www.codestam.com') && <span><strong>W:</strong> {data.company.website || 'www.codestam.com'}</span>}
          </div>
        </div>
      </div>
    </div>

    {/* Executive Letter Header */}
    <div className="mb-12">
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-wide">EXECUTIVE EMPLOYMENT OFFER</h2>
        <div className="flex justify-between items-center">
          <div>
            <div className="text-sm text-gray-600 mb-1">OFFER DATE</div>
            <div className="font-semibold">{formatDate(data.letterDate)}</div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-600 mb-1">POSITION LEVEL</div>
            <div className="font-semibold">{data.job.employmentType}</div>
          </div>
        </div>
      </div>
    </div>

    {/* Candidate Information */}
    <div className="mb-10">
      <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-800">
        <div className="font-bold text-xl text-gray-900 mb-3">{data.candidate.firstName} {data.candidate.lastName}</div>
        <div className="text-gray-700 text-sm leading-relaxed">
          {data.candidate.address}<br />
          {data.candidate.city}, {data.candidate.state} {data.candidate.zip}<br />
          <div className="mt-2">
            <strong>Email:</strong> {data.candidate.email} | <strong>Phone:</strong> {data.candidate.phone}
          </div>
        </div>
      </div>
    </div>

    {/* Letter Body */}
    <div className="space-y-8 text-gray-800 leading-relaxed mb-12">
      <p className="text-lg font-medium">Dear {data.candidate.firstName},</p>
      
      <p>On behalf of {data.company.name}, I am delighted to extend this formal offer of employment for the executive position of <strong>{data.job.title}</strong> within our {data.job.department} division.</p>
      
      <p>Your exceptional qualifications, proven track record, and leadership capabilities make you the ideal candidate for this strategic role. We are excited about the prospect of you joining our executive team and contributing to our organization's continued growth and success.</p>

      {/* Executive Position Details */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">EXECUTIVE POSITION OVERVIEW</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Position Title</div>
              <div className="font-semibold text-gray-900">{data.job.title}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Division</div>
              <div className="font-semibold text-gray-900">{data.job.department}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Employment Classification</div>
              <div className="font-semibold text-gray-900">{data.job.employmentType}</div>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Reports To</div>
              <div className="font-semibold text-gray-900">{data.job.reportingManager}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Commencement Date</div>
              <div className="font-semibold text-gray-900">{formatDate(data.job.startDate)}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Work Arrangement</div>
              <div className="font-semibold text-gray-900">{data.job.workLocation}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Compensation */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">EXECUTIVE COMPENSATION PACKAGE</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-blue-200">
            <span className="font-semibold text-gray-700">Base Annual Salary</span>
            <span className="text-xl font-bold text-gray-900">{formatCurrency(data.compensation.baseSalary, data.compensation.currency)}</span>
          </div>
          {data.compensation.bonus && (
            <div className="flex justify-between items-center py-3 border-b border-blue-200">
              <span className="font-semibold text-gray-700">Performance Incentive</span>
              <span className="font-semibold text-gray-900">{data.compensation.bonus}</span>
            </div>
          )}
          {data.compensation.stockOptions && (
            <div className="flex justify-between items-center py-3 border-b border-blue-200">
              <span className="font-semibold text-gray-700">Equity Participation</span>
              <span className="font-semibold text-gray-900">{data.compensation.stockOptions}</span>
            </div>
          )}
          <div className="text-sm text-gray-600 mt-4 italic">
            * Compensation is paid {data.compensation.payFrequency.toLowerCase()} and subject to applicable tax deductions
          </div>
        </div>
      </div>

      <p>This offer includes our comprehensive executive benefits package, detailed terms of employment, and is subject to the successful completion of our standard pre-employment verification process.</p>
      
      <p>We are confident that this opportunity will provide you with the platform to further your career while making a significant impact on our organization's strategic direction.</p>
      
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 rounded-r-lg">
        <p className="font-semibold text-gray-900 mb-2">Offer Validity</p>
        <p className="text-sm">This offer remains valid until <strong>{formatDate(data.terms.offerValidUntil)}</strong>. We kindly request your response by this date to proceed with the onboarding process.</p>
      </div>
      
      <p>Should you have any questions or require additional information, please feel free to contact me directly. We look forward to your positive response and to welcoming you to our executive leadership team.</p>
      
      <p className="text-lg font-medium mt-8">With warm regards,</p>
    </div>

    {/* Executive Signature Section */}
    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <div className="border-b-3 border-gray-800 w-56 mb-4"></div>
        <div className="font-bold text-lg text-gray-900">{data.signerName}</div>
        <div className="text-gray-700 font-medium">{data.signerTitle}</div>
        <div className="text-gray-700">{data.company.name}</div>
        <div className="text-gray-600 text-sm mt-3 italic">Date: {formatDate(data.letterDate)}</div>
      </div>
      <div>
        <div className="border-b-3 border-gray-800 w-56 mb-4"></div>
        <div className="font-bold text-lg text-gray-900">{data.candidate.firstName} {data.candidate.lastName}</div>
        <div className="text-gray-700 font-medium">Acceptance Signature</div>
        <div className="text-gray-600 text-sm mt-3 italic">Date: _______________</div>
      </div>
    </div>

    {/* Executive Footer */}
    <div className="mt-16 pt-8 border-t-2 border-gray-800 text-center">
      <div className="text-xs text-gray-500 leading-relaxed">
        <p className="font-semibold mb-2">CONFIDENTIAL EXECUTIVE COMMUNICATION</p>
        <p>This document contains confidential and proprietary information of {data.company.name}.</p>
        <p className="mt-2">Generated on {formatDate(new Date().toISOString().split('T')[0])}</p>
      </div>
    </div>
  </div>
);

export const MinimalTemplate: React.FC<TemplateProps> = ({ data, companyLogo, formatCurrency, formatDate }) => (
  <div className="bg-white p-16 shadow-sm max-w-4xl mx-auto" style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: '14px', lineHeight: '1.6' }}>
    {/* Minimal Header */}
    <div className="flex justify-between items-center mb-16 pb-4 border-b border-gray-200">
      <div>
        <div className="mb-4">
          {companyLogo ? (
            <img 
              src={companyLogo} 
              alt="Company Logo" 
              className="h-12 w-auto object-contain"
              style={{ maxWidth: '120px' }}
            />
          ) : (
            <div className="h-12 w-24 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs">
              Logo
            </div>
          )}
        </div>
        <h1 className="text-xl font-semibold text-gray-900">
          {data.company.name || 'Codestam Technologies Pvt Ltd'}
        </h1>
      </div>
      <div className="text-right text-sm text-gray-600">
        {formatDate(data.letterDate)}
      </div>
    </div>

    {/* Candidate */}
    <div className="mb-12">
      <div className="font-semibold text-gray-900">{data.candidate.firstName} {data.candidate.lastName}</div>
      <div className="text-sm text-gray-600 mt-1">
        {data.candidate.email} | {data.candidate.phone}
      </div>
    </div>

    {/* Letter Content */}
    <div className="space-y-8 text-gray-800 mb-16">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Employment Offer</h2>
        <p>We are pleased to offer you the position of <strong>{data.job.title}</strong> at {data.company.name}.</p>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Position Details</h3>
        <div className="space-y-2 text-sm">
          <div>Title: {data.job.title}</div>
          <div>Department: {data.job.department}</div>
          <div>Start Date: {formatDate(data.job.startDate)}</div>
          <div>Location: {data.job.workLocation}</div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Compensation</h3>
        <div className="space-y-2 text-sm">
          <div>Salary: {formatCurrency(data.compensation.baseSalary, data.compensation.currency)} {data.compensation.payFrequency.toLowerCase()}</div>
          {data.compensation.bonus && <div>Bonus: {data.compensation.bonus}</div>}
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-gray-900 mb-3">Terms</h3>
        <div className="space-y-2 text-sm">
          <div>Probation: {data.terms.probationPeriod}</div>
          <div>Notice Period: {data.terms.noticePeriod}</div>
          <div>Offer Valid Until: {formatDate(data.terms.offerValidUntil)}</div>
        </div>
      </div>

      <p>Please confirm your acceptance by signing and returning this letter.</p>
    </div>

    {/* Minimal Signatures */}
    <div className="grid grid-cols-2 gap-16 pt-8 border-t border-gray-200">
      <div>
        <div className="border-b border-gray-400 w-48 mb-2"></div>
        <div className="text-sm">
          <div className="font-semibold">{data.signerName}</div>
          <div className="text-gray-600">{data.signerTitle}</div>
        </div>
      </div>
      <div>
        <div className="border-b border-gray-400 w-48 mb-2"></div>
        <div className="text-sm">
          <div className="font-semibold">{data.candidate.firstName} {data.candidate.lastName}</div>
          <div className="text-gray-600">Date: ___________</div>
        </div>
      </div>
    </div>
  </div>
);

export const CorporateTemplate: React.FC<TemplateProps> = ({ data, companyLogo, formatCurrency, formatDate }) => (
  <div className="bg-white p-12 shadow-sm max-w-4xl mx-auto border" style={{ fontFamily: 'Arial, sans-serif', fontSize: '14px', lineHeight: '1.6' }}>
    {/* Corporate Header */}
    <div className="bg-gray-900 text-white p-8 -m-12 mb-12">
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
            <h1 className="text-2xl font-bold mb-2">
              {data.company.name || 'Codestam Technologies Pvt Ltd'}
            </h1>
            <div className="text-gray-300 text-sm">
              Human Resources Department
            </div>
          </div>
        </div>
        <div className="text-right text-sm text-gray-300">
          <div>OFFER LETTER</div>
          <div className="font-semibold text-white">{formatDate(data.letterDate)}</div>
        </div>
      </div>
    </div>

    {/* Reference Number */}
    <div className="mb-8 text-right">
      <div className="text-sm text-gray-600">
        <strong>Ref:</strong> HR/OL/{new Date().getFullYear()}/{Math.floor(Math.random() * 1000).toString().padStart(3, '0')}
      </div>
    </div>

    {/* Candidate Information */}
    <div className="mb-10 bg-gray-50 p-6 rounded">
      <div className="font-bold text-lg text-gray-900 mb-2">{data.candidate.firstName} {data.candidate.lastName}</div>
      <div className="text-gray-700 text-sm">
        {data.candidate.address}<br />
        {data.candidate.city}, {data.candidate.state} {data.candidate.zip}<br />
        Email: {data.candidate.email} | Phone: {data.candidate.phone}
      </div>
    </div>

    {/* Subject Line */}
    <div className="mb-8">
      <div className="font-bold text-gray-900">
        <strong>Subject:</strong> Offer of Employment - {data.job.title}
      </div>
    </div>

    {/* Letter Body */}
    <div className="space-y-6 text-gray-800 mb-12">
      <p>Dear {data.candidate.firstName},</p>
      
      <p>Further to our discussions, we are pleased to offer you employment with {data.company.name} in the capacity of <strong>{data.job.title}</strong> in the {data.job.department} department.</p>

      {/* Corporate Details Table */}
      <div className="my-8">
        <h3 className="font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">EMPLOYMENT PARTICULARS</h3>
        <table className="w-full border-collapse border border-gray-300">
          <tbody>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold w-1/3">Position</td>
              <td className="border border-gray-300 p-3">{data.job.title}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Department</td>
              <td className="border border-gray-300 p-3">{data.job.department}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Employment Type</td>
              <td className="border border-gray-300 p-3">{data.job.employmentType}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Reporting Manager</td>
              <td className="border border-gray-300 p-3">{data.job.reportingManager}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Date of Joining</td>
              <td className="border border-gray-300 p-3">{formatDate(data.job.startDate)}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Work Location</td>
              <td className="border border-gray-300 p-3">{data.job.workLocation}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Salary</td>
              <td className="border border-gray-300 p-3 font-semibold">{formatCurrency(data.compensation.baseSalary, data.compensation.currency)} {data.compensation.payFrequency.toLowerCase()}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Probation Period</td>
              <td className="border border-gray-300 p-3">{data.terms.probationPeriod}</td>
            </tr>
            <tr className="border border-gray-300">
              <td className="border border-gray-300 p-3 bg-gray-50 font-semibold">Notice Period</td>
              <td className="border border-gray-300 p-3">{data.terms.noticePeriod}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p>Your employment will be subject to the terms and conditions outlined in the Employee Handbook and your signed employment contract.</p>

      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r">
        <p className="font-semibold text-blue-900">Important Notice:</p>
        <p className="text-blue-800 text-sm mt-1">This offer is valid until <strong>{formatDate(data.terms.offerValidUntil)}</strong>. Please confirm your acceptance by signing and returning this letter along with the required documents.</p>
      </div>

      <p>We look forward to your positive response and to welcoming you to our team.</p>
      
      <p>Yours sincerely,</p>
    </div>

    {/* Corporate Signature */}
    <div className="mt-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="border-b-2 border-gray-800 w-56 mb-3"></div>
          <div className="font-bold text-gray-900">{data.signerName}</div>
          <div className="text-gray-700">{data.signerTitle}</div>
          <div className="text-gray-700">{data.company.name}</div>
          <div className="text-gray-600 text-sm mt-2">Date: {formatDate(data.letterDate)}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600 mb-4">ACCEPTANCE</div>
          <div className="border-b-2 border-gray-800 w-56 mb-3"></div>
          <div className="font-bold text-gray-900">{data.candidate.firstName} {data.candidate.lastName}</div>
          <div className="text-gray-700">Employee Signature</div>
          <div className="text-gray-600 text-sm mt-2">Date: _______________</div>
        </div>
      </div>
    </div>

    {/* Corporate Footer */}
    <div className="mt-12 pt-6 border-t border-gray-300 bg-gray-50 -mx-12 px-12 py-6">
      <div className="text-center text-xs text-gray-500">
        <p><strong>{data.company.name}</strong></p>
        <p>{data.company.address || '123 Tech Park, Sector 5'}, {data.company.city || 'Mumbai'}, {data.company.state || 'Maharashtra'} {data.company.zip || '400001'}</p>
        <p className="mt-2">This is a system-generated document. Generated on {formatDate(new Date().toISOString().split('T')[0])}</p>
      </div>
    </div>
  </div>
);

export const templateOptions = [
  { value: 'modern', label: 'Modern Professional', description: 'Clean layout with logo on left, company details on right' },
  { value: 'classic', label: 'Classic Business', description: 'Traditional centered header with formal styling' },
  { value: 'executive', label: 'Executive Premium', description: 'Elegant design with enhanced typography' },
  { value: 'minimal', label: 'Minimal Clean', description: 'Simple, clean design with minimal styling' },
  { value: 'corporate', label: 'Corporate Standard', description: 'Standard corporate format with structured layout' }
];