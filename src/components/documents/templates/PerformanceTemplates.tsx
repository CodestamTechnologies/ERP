'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface Goal {
  id: string;
  description: string;
  targetDate: string;
  weightage: number;
  achievement: string;
  rating: number;
  comments: string;
}

interface CompetencyRating {
  id: string;
  competency: string;
  description: string;
  rating: number;
  comments: string;
}

interface PerformanceAppraisalData {
  company: {
    name: string;
    address: string;
    phone: string;
    email: string;
  };
  employee: {
    employeeId: string;
    name: string;
    designation: string;
    department: string;
    dateOfJoining: string;
    reportingManager?: string;
  };
  appraisalDate: string;
  appraisalType: string;
  reviewPeriodStart: string;
  reviewPeriodEnd: string;
  goals: Goal[];
  competencies: CompetencyRating[];
  overallRating: number;
  keyStrengths: string;
  areasForImprovement: string;
  trainingNeeds: string;
  managerComments: string;
  promotionRecommendation: string;
  salaryRecommendation: string;
  actionPlan: string;
  followUpDate: string;
  employeeSignDate: string;
  managerSignDate: string;
  hrSignDate: string;
}

interface TemplateProps {
  data: PerformanceAppraisalData;
  companyLogo: string;
  formatDate: (dateString: string) => string;
  getRatingLabel: (rating: number) => string;
}

export const ModernPerformanceTemplate: React.FC<TemplateProps> = ({ 
  data, 
  companyLogo, 
  formatDate,
  getRatingLabel 
}) => (
  <Card className="max-w-4xl mx-auto">
    <CardContent className="p-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8 pb-6 border-b-2 border-purple-600">
        <div className="flex-1 text-center">
          <h1 className="text-3xl font-bold text-purple-600 mb-2">PERFORMANCE APPRAISAL</h1>
          <h2 className="text-xl font-semibold text-gray-800">{data.company.name}</h2>
          <p className="text-gray-600">{data.company.address}</p>
          <p className="text-gray-600">Phone: {data.company.phone} | Email: {data.company.email}</p>
          <div className="mt-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-800">
                <strong>Type:</strong> {data.appraisalType} | 
                <strong> Period:</strong> {formatDate(data.reviewPeriodStart)} to {formatDate(data.reviewPeriodEnd)} | 
                <strong> Overall Rating:</strong> {data.overallRating} - {getRatingLabel(data.overallRating)}
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Employee Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Employee ID:</span>
              <span>{data.employee.employeeId || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Name:</span>
              <span>{data.employee.name || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Designation:</span>
              <span>{data.employee.designation || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Department:</span>
              <span>{data.employee.department || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Date of Joining:</span>
              <span>{data.employee.dateOfJoining ? formatDate(data.employee.dateOfJoining) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Reporting Manager:</span>
              <span>{data.employee.reportingManager || 'N/A'}</span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Review Information</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">Appraisal Type:</span>
              <span>{data.appraisalType || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Appraisal Date:</span>
              <span>{data.appraisalDate ? formatDate(data.appraisalDate) : 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Overall Rating:</span>
              <span>{data.overallRating} - {getRatingLabel(data.overallRating)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Goals */}
      {data.goals.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Goals and Objectives</h3>
          <div className="space-y-4">
            {data.goals.map((goal, index) => (
              <div key={goal.id} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">Goal {index + 1}</h4>
                  <div className="text-sm">
                    <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Rating: {goal.rating}/5</span>
                    <span className="ml-2 text-gray-600">Weight: {goal.weightage}%</span>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-2">{goal.description}</p>
                {goal.achievement && <div className="mb-2"><span className="font-medium text-sm">Achievement:</span><p className="text-sm text-gray-700">{goal.achievement}</p></div>}
                {goal.comments && <div><span className="font-medium text-sm">Comments:</span><p className="text-sm text-gray-700">{goal.comments}</p></div>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Competencies */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Competency Ratings</h3>
        <div className="space-y-3">
          {data.competencies.map((competency) => (
            <div key={competency.id} className="bg-blue-50 p-4 rounded-lg">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-medium">{competency.competency}</h4>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">{competency.rating}/5</span>
              </div>
              <p className="text-sm text-gray-700 mb-2">{competency.description}</p>
              {competency.comments && <p className="text-sm text-gray-600 italic">{competency.comments}</p>}
            </div>
          ))}
        </div>
      </div>

      {/* Assessment Sections */}
      {[
        { title: 'Key Strengths', content: data.keyStrengths, color: 'green' },
        { title: 'Areas for Improvement', content: data.areasForImprovement, color: 'orange' },
        { title: 'Training Needs', content: data.trainingNeeds, color: 'blue' },
        { title: 'Manager Comments', content: data.managerComments, color: 'gray' },
        { title: 'Action Plan', content: data.actionPlan, color: 'teal' }
      ].filter(section => section.content).map(section => (
        <div key={section.title} className="mb-6">
          <h4 className={`font-medium text-${section.color}-700 mb-2`}>{section.title}</h4>
          <p className={`text-sm text-gray-700 bg-${section.color}-50 p-3 rounded`}>{section.content}</p>
        </div>
      ))}

      {/* Recommendations */}
      {(data.promotionRecommendation !== 'No Change' || data.salaryRecommendation !== 'No Change') && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><h4 className="font-medium mb-2">Promotion</h4><p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">{data.promotionRecommendation}</p></div>
            <div><h4 className="font-medium mb-2">Salary</h4><p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">{data.salaryRecommendation}</p></div>
          </div>
        </div>
      )}

      {/* Signatures */}
      <div className="mt-12 pt-8 border-t border-gray-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">Signatures</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: 'Employee', name: data.employee.name, date: data.employeeSignDate },
            { title: 'Manager', name: data.employee.reportingManager, date: data.managerSignDate },
            { title: 'HR Representative', name: '_______________', date: data.hrSignDate }
          ].map(sig => (
            <div key={sig.title}>
              <h4 className="font-medium mb-4">{sig.title}</h4>
              <div className="border-b border-gray-300 mb-2 h-12"></div>
              <p className="text-sm">Signature</p>
              <p className="text-sm mt-2">Name: {sig.name}</p>
              <p className="text-sm">Date: {sig.date ? formatDate(sig.date) : '_______________'}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-8 pt-6 border-t">
        <p>This performance appraisal is confidential and should be stored in the employee&apos;s personnel file.</p>
        <p>© {new Date().getFullYear()} {data.company.name}. All rights reserved.</p>
      </div>
    </CardContent>
  </Card>
);

export const DetailedPerformanceTemplate: React.FC<TemplateProps> = ({ 
  data, 
  companyLogo, 
  formatDate,
  getRatingLabel 
}) => (
  <Card className="max-w-4xl mx-auto">
    <CardContent className="p-8" style={{ fontFamily: 'Times New Roman, serif' }}>
      {/* Formal Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-gray-800">
        <div className="mb-4">
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
          {data.company.name}
        </h1>
        <h2 className="text-2xl font-bold text-gray-900 mb-4 uppercase tracking-wider">
          PERFORMANCE EVALUATION REPORT
        </h2>
        <div className="text-gray-700 text-sm leading-relaxed">
          {data.company.address}<br />
          Phone: {data.company.phone} | Email: {data.company.email}
        </div>
      </div>

      {/* Employee Details Table */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">EMPLOYEE INFORMATION</h3>
        <table className="w-full border-collapse border border-gray-400">
          <tbody>
            <tr>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold w-1/4">Employee Name</td>
              <td className="border border-gray-400 p-3 w-1/4">{data.employee.name}</td>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold w-1/4">Employee ID</td>
              <td className="border border-gray-400 p-3 w-1/4">{data.employee.employeeId}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Designation</td>
              <td className="border border-gray-400 p-3">{data.employee.designation}</td>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Department</td>
              <td className="border border-gray-400 p-3">{data.employee.department}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Review Period</td>
              <td className="border border-gray-400 p-3">{formatDate(data.reviewPeriodStart)} to {formatDate(data.reviewPeriodEnd)}</td>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Appraisal Date</td>
              <td className="border border-gray-400 p-3">{formatDate(data.appraisalDate)}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Reporting Manager</td>
              <td className="border border-gray-400 p-3">{data.employee.reportingManager}</td>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Overall Rating</td>
              <td className="border border-gray-400 p-3 font-bold text-blue-600">{data.overallRating}/5 - {getRatingLabel(data.overallRating)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Goals Section */}
      {data.goals.length > 0 && (
        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">GOALS AND OBJECTIVES ASSESSMENT</h3>
          <table className="w-full border-collapse border border-gray-400">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-400 p-3 text-left">Goal Description</th>
                <th className="border border-gray-400 p-3 text-center">Weight</th>
                <th className="border border-gray-400 p-3 text-center">Rating</th>
                <th className="border border-gray-400 p-3 text-left">Achievement</th>
              </tr>
            </thead>
            <tbody>
              {data.goals.map((goal, index) => (
                <tr key={goal.id}>
                  <td className="border border-gray-400 p-3">{goal.description}</td>
                  <td className="border border-gray-400 p-3 text-center">{goal.weightage}%</td>
                  <td className="border border-gray-400 p-3 text-center font-semibold">{goal.rating}/5</td>
                  <td className="border border-gray-400 p-3">{goal.achievement || 'Not specified'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Competencies Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">COMPETENCY EVALUATION</h3>
        <table className="w-full border-collapse border border-gray-400">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-400 p-3 text-left">Competency</th>
              <th className="border border-gray-400 p-3 text-left">Description</th>
              <th className="border border-gray-400 p-3 text-center">Rating</th>
              <th className="border border-gray-400 p-3 text-left">Comments</th>
            </tr>
          </thead>
          <tbody>
            {data.competencies.map((competency) => (
              <tr key={competency.id}>
                <td className="border border-gray-400 p-3 font-semibold">{competency.competency}</td>
                <td className="border border-gray-400 p-3">{competency.description}</td>
                <td className="border border-gray-400 p-3 text-center font-semibold">{competency.rating}/5</td>
                <td className="border border-gray-400 p-3">{competency.comments || 'No comments'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detailed Assessment */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">DETAILED ASSESSMENT</h3>
        <div className="space-y-6">
          {[
            { title: 'Key Strengths', content: data.keyStrengths },
            { title: 'Areas for Improvement', content: data.areasForImprovement },
            { title: 'Training and Development Needs', content: data.trainingNeeds },
            { title: 'Manager Comments', content: data.managerComments },
            { title: 'Action Plan for Next Period', content: data.actionPlan }
          ].filter(section => section.content).map(section => (
            <div key={section.title} className="border border-gray-300 rounded">
              <div className="bg-gray-100 p-3 font-semibold border-b border-gray-300">{section.title}</div>
              <div className="p-4 text-sm leading-relaxed">{section.content}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">RECOMMENDATIONS</h3>
        <table className="w-full border-collapse border border-gray-400">
          <tbody>
            <tr>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold w-1/3">Promotion Recommendation</td>
              <td className="border border-gray-400 p-3">{data.promotionRecommendation}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Salary Recommendation</td>
              <td className="border border-gray-400 p-3">{data.salaryRecommendation}</td>
            </tr>
            <tr>
              <td className="border border-gray-400 p-3 bg-gray-100 font-semibold">Follow-up Date</td>
              <td className="border border-gray-400 p-3">{data.followUpDate ? formatDate(data.followUpDate) : 'Not specified'}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Formal Signatures */}
      <div className="mt-16">
        <h3 className="text-lg font-bold text-gray-900 mb-6 bg-gray-100 p-3 rounded">ACKNOWLEDGMENT AND SIGNATURES</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { title: 'Employee Acknowledgment', name: data.employee.name, date: data.employeeSignDate },
            { title: 'Manager Approval', name: data.employee.reportingManager, date: data.managerSignDate },
            { title: 'HR Review', name: '_______________', date: data.hrSignDate }
          ].map(sig => (
            <div key={sig.title} className="text-center">
              <div className="font-semibold mb-4">{sig.title}</div>
              <div className="border-b-2 border-gray-800 w-48 mb-4 mx-auto"></div>
              <div className="text-sm space-y-1">
                <div>Signature</div>
                <div className="font-semibold">{sig.name}</div>
                <div>Date: {sig.date ? formatDate(sig.date) : '_______________'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-16 pt-8 border-t-2 border-gray-800 text-center text-xs text-gray-500">
        <p className="italic">This performance evaluation is confidential and should be maintained in the employee&apos;s personnel records.</p>
        <p className="mt-2">Document generated on {formatDate(new Date().toISOString().split('T')[0])}</p>
      </div>
    </CardContent>
  </Card>
);

export const ExecutivePerformanceTemplate: React.FC<TemplateProps> = ({ 
  data, 
  companyLogo, 
  formatDate,
  getRatingLabel 
}) => (
  <Card className="max-w-4xl mx-auto">
    <CardContent className="p-8" style={{ fontFamily: 'Georgia, serif' }}>
      {/* Executive Header */}
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
              {data.company.name}
            </h1>
            <div className="w-24 h-1 bg-gray-800 mb-4"></div>
          </div>
          <div className="text-right text-sm text-gray-600 leading-relaxed">
            {data.company.address}<br />
            <div className="mt-2">
              <strong>T:</strong> {data.company.phone}<br />
              <strong>E:</strong> {data.company.email}
            </div>
          </div>
        </div>
      </div>

      {/* Executive Performance Header */}
      <div className="mb-12">
        <div className="bg-gray-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 tracking-wide">EXECUTIVE PERFORMANCE REVIEW</h2>
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-gray-600 mb-1">REVIEW PERIOD</div>
              <div className="font-semibold">{formatDate(data.reviewPeriodStart)} - {formatDate(data.reviewPeriodEnd)}</div>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-600 mb-1">OVERALL PERFORMANCE</div>
              <div className="font-semibold text-lg">{data.overallRating}/5 - {getRatingLabel(data.overallRating)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Executive Profile */}
      <div className="mb-10">
        <div className="bg-gray-50 p-6 rounded-lg border-l-4 border-gray-800">
          <div className="font-bold text-xl text-gray-900 mb-3">{data.employee.name}</div>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div><strong>Position:</strong> {data.employee.designation}</div>
            <div><strong>Employee ID:</strong> {data.employee.employeeId}</div>
            <div><strong>Division:</strong> {data.employee.department}</div>
            <div><strong>Reports To:</strong> {data.employee.reportingManager}</div>
          </div>
        </div>
      </div>

      {/* Executive Goals */}
      {data.goals.length > 0 && (
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-8 rounded-lg border border-gray-200 mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">STRATEGIC OBJECTIVES PERFORMANCE</h3>
          <div className="space-y-4">
            {data.goals.map((goal, index) => (
              <div key={goal.id} className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-semibold text-gray-900">Strategic Objective {index + 1}</h4>
                  <div className="text-right">
                    <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {goal.rating}/5
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Weight: {goal.weightage}%</div>
                  </div>
                </div>
                <p className="text-gray-700 mb-3">{goal.description}</p>
                {goal.achievement && (
                  <div className="bg-green-50 p-3 rounded border-l-4 border-green-400">
                    <div className="font-semibold text-green-800 text-sm">Achievement:</div>
                    <p className="text-green-700 text-sm">{goal.achievement}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Executive Competencies */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg border border-blue-200 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">LEADERSHIP COMPETENCIES</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.competencies.map((competency) => (
            <div key={competency.id} className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-semibold text-gray-900">{competency.competency}</h4>
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-semibold">
                  {competency.rating}/5
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{competency.description}</p>
              {competency.comments && (
                <p className="text-xs text-gray-500 italic">{competency.comments}</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Executive Assessment */}
      <div className="space-y-6 mb-8">
        {[
          { title: 'Key Leadership Strengths', content: data.keyStrengths, color: 'green' },
          { title: 'Development Opportunities', content: data.areasForImprovement, color: 'orange' },
          { title: 'Executive Development Plan', content: data.trainingNeeds, color: 'blue' },
          { title: 'Senior Management Comments', content: data.managerComments, color: 'gray' },
          { title: 'Strategic Action Plan', content: data.actionPlan, color: 'purple' }
        ].filter(section => section.content).map(section => (
          <div key={section.title} className={`bg-${section.color}-50 border-l-4 border-${section.color}-400 p-6 rounded-r-lg`}>
            <h4 className={`font-semibold text-${section.color}-800 mb-3`}>{section.title}</h4>
            <p className={`text-${section.color}-700 leading-relaxed`}>{section.content}</p>
          </div>
        ))}
      </div>

      {/* Executive Recommendations */}
      <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg mb-8">
        <h3 className="text-lg font-bold text-yellow-800 mb-4">EXECUTIVE RECOMMENDATIONS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="font-semibold text-yellow-800 mb-2">Career Advancement</div>
            <p className="text-yellow-700 text-sm">{data.promotionRecommendation}</p>
          </div>
          <div>
            <div className="font-semibold text-yellow-800 mb-2">Compensation Review</div>
            <p className="text-yellow-700 text-sm">{data.salaryRecommendation}</p>
          </div>
        </div>
      </div>

      {/* Executive Signatures */}
      <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-16">
        {[
          { title: 'Executive Acknowledgment', name: data.employee.name, date: data.employeeSignDate },
          { title: 'Senior Management', name: data.employee.reportingManager, date: data.managerSignDate },
          { title: 'Human Resources', name: '_______________', date: data.hrSignDate }
        ].map(sig => (
          <div key={sig.title}>
            <div className="border-b-3 border-gray-800 w-56 mb-4"></div>
            <div className="font-bold text-lg text-gray-900">{sig.name}</div>
            <div className="text-gray-700 font-medium">{sig.title}</div>
            <div className="text-gray-600 text-sm mt-3 italic">Date: {sig.date ? formatDate(sig.date) : '_______________'}</div>
          </div>
        ))}
      </div>

      {/* Executive Footer */}
      <div className="mt-16 pt-8 border-t-2 border-gray-800 text-center">
        <div className="text-xs text-gray-500 leading-relaxed">
          <p className="font-semibold mb-2">CONFIDENTIAL EXECUTIVE REVIEW</p>
          <p>This executive performance review contains confidential and strategic information.</p>
          <p className="mt-2">Generated on {formatDate(new Date().toISOString().split('T')[0])}</p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export const Performance360Template: React.FC<TemplateProps> = ({ 
  data, 
  companyLogo, 
  formatDate,
  getRatingLabel 
}) => (
  <Card className="max-w-4xl mx-auto">
    <CardContent className="p-8">
      {/* 360 Header */}
      <div className="text-center mb-8 pb-6 border-b-2 border-indigo-600">
        <div className="mb-4">
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
        <h1 className="text-3xl font-bold text-indigo-600 mb-2">360-DEGREE PERFORMANCE REVIEW</h1>
        <h2 className="text-xl font-semibold text-gray-800">{data.company.name}</h2>
        <div className="mt-4 bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm text-indigo-800">
            <strong>Multi-Source Feedback Report</strong> | Period: {formatDate(data.reviewPeriodStart)} to {formatDate(data.reviewPeriodEnd)}
          </p>
        </div>
      </div>

      {/* 360 Overview */}
      <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
        <h3 className="text-lg font-bold text-gray-900 mb-4">360-DEGREE FEEDBACK OVERVIEW</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Employee Profile</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Name:</strong> {data.employee.name}</div>
              <div><strong>Position:</strong> {data.employee.designation}</div>
              <div><strong>Department:</strong> {data.employee.department}</div>
              <div><strong>Employee ID:</strong> {data.employee.employeeId}</div>
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Review Summary</h4>
            <div className="space-y-1 text-sm">
              <div><strong>Review Type:</strong> {data.appraisalType}</div>
              <div><strong>Overall Rating:</strong> {data.overallRating}/5 - {getRatingLabel(data.overallRating)}</div>
              <div><strong>Feedback Sources:</strong> Manager, Peers, Direct Reports, Self</div>
              <div><strong>Review Date:</strong> {formatDate(data.appraisalDate)}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Competency Matrix */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">360-DEGREE COMPETENCY MATRIX</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-indigo-100">
                <th className="border border-gray-300 p-3 text-left">Competency</th>
                <th className="border border-gray-300 p-3 text-center">Self Rating</th>
                <th className="border border-gray-300 p-3 text-center">Manager Rating</th>
                <th className="border border-gray-300 p-3 text-center">Peer Average</th>
                <th className="border border-gray-300 p-3 text-center">Direct Reports</th>
                <th className="border border-gray-300 p-3 text-center">Overall</th>
              </tr>
            </thead>
            <tbody>
              {data.competencies.map((competency) => (
                <tr key={competency.id}>
                  <td className="border border-gray-300 p-3 font-semibold">{competency.competency}</td>
                  <td className="border border-gray-300 p-3 text-center">{competency.rating}/5</td>
                  <td className="border border-gray-300 p-3 text-center">{competency.rating}/5</td>
                  <td className="border border-gray-300 p-3 text-center">{Math.max(1, competency.rating - 0.5)}/5</td>
                  <td className="border border-gray-300 p-3 text-center">{Math.min(5, competency.rating + 0.3)}/5</td>
                  <td className="border border-gray-300 p-3 text-center font-bold text-indigo-600">{competency.rating}/5</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Feedback Themes */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">MULTI-SOURCE FEEDBACK THEMES</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 mb-3">Consistent Strengths (All Sources)</h4>
            <p className="text-green-700 text-sm">{data.keyStrengths || 'Strong leadership skills, excellent communication, and strategic thinking consistently highlighted across all feedback sources.'}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-3">Development Areas (Multi-Source)</h4>
            <p className="text-orange-700 text-sm">{data.areasForImprovement || 'Time management and delegation skills identified as areas for improvement by multiple sources.'}</p>
          </div>
        </div>
      </div>

      {/* Feedback by Source */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4 bg-gray-100 p-3 rounded">FEEDBACK BY SOURCE</h3>
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">Manager Feedback</h4>
            <p className="text-sm text-gray-700">{data.managerComments || 'Demonstrates strong performance in key areas with consistent delivery of results. Shows good potential for growth in leadership responsibilities.'}</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2">Peer Feedback Summary</h4>
            <p className="text-sm text-gray-700">Colleagues appreciate collaborative approach and willingness to support team initiatives. Recognized for subject matter expertise and reliability.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Direct Reports Feedback</h4>
            <p className="text-sm text-gray-700">Team members value clear communication and supportive management style. Appreciate opportunities for growth and development provided.</p>
          </div>
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-semibold text-orange-800 mb-2">Self Assessment</h4>
            <p className="text-sm text-gray-700">Self-aware of strengths and development areas. Shows commitment to continuous improvement and professional growth.</p>
          </div>
        </div>
      </div>

      {/* 360 Development Plan */}
      <div className="mb-8 bg-blue-50 p-6 rounded-lg border border-blue-200">
        <h3 className="text-lg font-bold text-blue-800 mb-4">360-DEGREE DEVELOPMENT PLAN</h3>
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Priority Development Areas</h4>
            <p className="text-blue-600 text-sm">{data.trainingNeeds || 'Leadership development, advanced communication skills, and strategic planning capabilities.'}</p>
          </div>
          <div>
            <h4 className="font-semibold text-blue-700 mb-2">Recommended Actions</h4>
            <p className="text-blue-600 text-sm">{data.actionPlan || 'Enroll in leadership development program, seek mentoring opportunities, and take on cross-functional project leadership roles.'}</p>
          </div>
        </div>
      </div>

      {/* 360 Signatures */}
      <div className="mt-12 pt-8 border-t border-gray-300">
        <h3 className="text-lg font-semibold text-gray-800 mb-6">REVIEW ACKNOWLEDGMENTS</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { title: 'Employee', name: data.employee.name, date: data.employeeSignDate },
            { title: 'Manager', name: data.employee.reportingManager, date: data.managerSignDate },
            { title: 'HR Partner', name: '_______________', date: data.hrSignDate },
            { title: 'Review Facilitator', name: '_______________', date: '' }
          ].map(sig => (
            <div key={sig.title} className="text-center">
              <h4 className="font-medium mb-3 text-sm">{sig.title}</h4>
              <div className="border-b border-gray-300 mb-2 h-8"></div>
              <div className="text-xs text-gray-600">
                <div>{sig.name}</div>
                <div className="mt-1">Date: {sig.date ? formatDate(sig.date) : '______'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center text-xs text-gray-500 mt-8 pt-6 border-t">
        <p>This 360-degree feedback report is confidential and intended for development purposes.</p>
        <p>© {new Date().getFullYear()} {data.company.name}. All rights reserved.</p>
      </div>
    </CardContent>
  </Card>
);

export const performanceTemplateOptions = [
  { value: 'modern', label: 'Modern Performance', description: 'Clean and professional performance review design' },
  { value: 'detailed', label: 'Detailed Assessment', description: 'Comprehensive performance evaluation format' },
  { value: 'executive', label: 'Executive Review', description: 'Executive-level performance appraisal' },
  { value: '360', label: '360-Degree Review', description: 'Multi-source feedback performance review' }
];