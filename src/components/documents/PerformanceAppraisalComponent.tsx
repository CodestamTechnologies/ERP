'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, FileText } from 'lucide-react';
import { BaseDocumentComponent, FormField, formatDate } from './BaseDocumentComponent';
import { CompanyInfo, EmployeeInfo, BaseHRDocument, RATING_OPTIONS, getRatingLabel, DEFAULT_COMPANY, DEFAULT_EMPLOYEE } from '@/types/hrDocuments';
import { 
  ModernPerformanceTemplate, 
  DetailedPerformanceTemplate, 
  ExecutivePerformanceTemplate, 
  Performance360Template,
  performanceTemplateOptions 
} from './templates/PerformanceTemplates';

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

interface PerformanceAppraisalData extends BaseHRDocument {
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

const DEFAULT_COMPETENCIES: CompetencyRating[] = [
  { id: 'comp1', competency: 'Technical Skills', description: 'Demonstrates proficiency in required technical skills', rating: 0, comments: '' },
  { id: 'comp2', competency: 'Communication', description: 'Communicates effectively with team members', rating: 0, comments: '' },
  { id: 'comp3', competency: 'Problem Solving', description: 'Identifies problems and develops solutions', rating: 0, comments: '' },
  { id: 'comp4', competency: 'Teamwork', description: 'Works collaboratively with others', rating: 0, comments: '' },
  { id: 'comp5', competency: 'Leadership', description: 'Demonstrates leadership qualities', rating: 0, comments: '' },
  { id: 'comp6', competency: 'Initiative', description: 'Takes initiative and shows proactive approach', rating: 0, comments: '' }
];

const initialData = (): PerformanceAppraisalData => ({
  company: DEFAULT_COMPANY,
  employee: { ...DEFAULT_EMPLOYEE, reportingManager: '' },
  appraisalDate: new Date().toISOString().split('T')[0],
  appraisalType: 'Annual',
  reviewPeriodStart: new Date(new Date().getFullYear(), 0, 1).toISOString().split('T')[0],
  reviewPeriodEnd: new Date(new Date().getFullYear(), 11, 31).toISOString().split('T')[0],
  goals: [],
  competencies: DEFAULT_COMPETENCIES,
  overallRating: 0,
  keyStrengths: '',
  areasForImprovement: '',
  trainingNeeds: '',
  managerComments: '',
  promotionRecommendation: 'No Change',
  salaryRecommendation: 'No Change',
  actionPlan: '',
  followUpDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  employeeSignDate: '',
  managerSignDate: '',
  hrSignDate: ''
});

const createNewGoal = (): Goal => ({
  id: `goal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  description: '',
  targetDate: '',
  weightage: 20,
  achievement: '',
  rating: 0,
  comments: ''
});

const createNewCompetency = (): CompetencyRating => ({
  id: `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  competency: '',
  description: '',
  rating: 0,
  comments: ''
});

// Reusable Goal Component
const GoalCard = ({ goal, index, onUpdate, onRemove }: {
  goal: Goal;
  index: number;
  onUpdate: (field: keyof Goal, value: string | number) => void;
  onRemove: () => void;
}) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-medium">Goal {index + 1}</h4>
      <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-600">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
    <div className="space-y-3">
      <FormField
        label="Goal Description"
        id={`goal-desc-${goal.id}`}
        value={goal.description}
        onChange={(value) => onUpdate('description', value)}
        type="textarea"
        rows={2}
        required
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <FormField
          label="Target Date"
          id={`goal-target-${goal.id}`}
          value={goal.targetDate}
          onChange={(value) => onUpdate('targetDate', value)}
          type="date"
        />
        <FormField
          label="Weightage (%)"
          id={`goal-weight-${goal.id}`}
          value={goal.weightage}
          onChange={(value) => onUpdate('weightage', Number(value))}
          type="number"
        />
        <FormField
          label="Rating (1-5)"
          id={`goal-rating-${goal.id}`}
          value={goal.rating}
          onChange={(value) => onUpdate('rating', Number(value))}
          type="select"
          options={RATING_OPTIONS}
        />
      </div>
      <FormField
        label="Achievement Description"
        id={`goal-achievement-${goal.id}`}
        value={goal.achievement}
        onChange={(value) => onUpdate('achievement', value)}
        type="textarea"
        rows={2}
      />
      <FormField
        label="Comments"
        id={`goal-comments-${goal.id}`}
        value={goal.comments}
        onChange={(value) => onUpdate('comments', value)}
        type="textarea"
        rows={2}
      />
    </div>
  </div>
);

// Reusable Competency Component
const CompetencyCard = ({ competency, index, onUpdate, onRemove, canRemove }: {
  competency: CompetencyRating;
  index: number;
  onUpdate: (field: keyof CompetencyRating, value: string | number) => void;
  onRemove: () => void;
  canRemove: boolean;
}) => (
  <div className="border border-gray-200 rounded-lg p-4">
    <div className="flex justify-between items-start mb-3">
      <h4 className="font-medium">Competency {index + 1}</h4>
      {canRemove && (
        <Button variant="ghost" size="sm" onClick={onRemove} className="text-red-600">
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
    <div className="space-y-3">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FormField
          label="Competency Name"
          id={`comp-name-${competency.id}`}
          value={competency.competency}
          onChange={(value) => onUpdate('competency', value)}
          required
        />
        <FormField
          label="Rating (1-5)"
          id={`comp-rating-${competency.id}`}
          value={competency.rating}
          onChange={(value) => onUpdate('rating', Number(value))}
          type="select"
          options={RATING_OPTIONS}
        />
      </div>
      <FormField
        label="Description"
        id={`comp-desc-${competency.id}`}
        value={competency.description}
        onChange={(value) => onUpdate('description', value)}
        type="textarea"
        rows={2}
      />
      <FormField
        label="Comments"
        id={`comp-comments-${competency.id}`}
        value={competency.comments}
        onChange={(value) => onUpdate('comments', value)}
        type="textarea"
        rows={2}
      />
    </div>
  </div>
);

export default function PerformanceAppraisalComponent() {
  const [data, setData] = useState<PerformanceAppraisalData>(initialData());
  const [companyLogo, setCompanyLogo] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');

  const updateCompany = (field: keyof CompanyInfo, value: string) => {
    setData(prev => ({ ...prev, company: { ...prev.company, [field]: value } }));
  };

  const updateEmployee = (field: keyof EmployeeInfo, value: string) => {
    setData(prev => ({ ...prev, employee: { ...prev.employee, [field]: value } }));
  };

  const updateField = (field: keyof PerformanceAppraisalData, value: string | number) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateGoal = (goalId: string, field: keyof Goal, value: string | number) => {
    setData(prev => ({
      ...prev,
      goals: prev.goals.map(goal => 
        goal.id === goalId ? { ...goal, [field]: value } : goal
      )
    }));
  };

  const updateCompetency = (competencyId: string, field: keyof CompetencyRating, value: string | number) => {
    setData(prev => ({
      ...prev,
      competencies: prev.competencies.map(comp => 
        comp.id === competencyId ? { ...comp, [field]: value } : comp
      )
    }));
  };

  const addGoal = () => setData(prev => ({ ...prev, goals: [...prev.goals, createNewGoal()] }));
  const removeGoal = (goalId: string) => setData(prev => ({ ...prev, goals: prev.goals.filter(goal => goal.id !== goalId) }));
  const addCompetency = () => setData(prev => ({ ...prev, competencies: [...prev.competencies, createNewCompetency()] }));
  const removeCompetency = (competencyId: string) => setData(prev => ({ ...prev, competencies: prev.competencies.filter(comp => comp.id !== competencyId) }));

  const calculateOverallRating = () => {
    const goalRatings = data.goals.map(goal => goal.rating * (goal.weightage / 100));
    const goalAverage = goalRatings.length > 0 ? goalRatings.reduce((sum, rating) => sum + rating, 0) : 0;
    
    const competencyRatings = data.competencies.map(comp => comp.rating);
    const competencyAverage = competencyRatings.length > 0 ? 
      competencyRatings.reduce((sum, rating) => sum + rating, 0) / competencyRatings.length : 0;
    
    const overall = (goalAverage + competencyAverage) / 2;
    updateField('overallRating', Math.round(overall * 10) / 10);
  };

  const handleLogoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        setCompanyLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeLogo = useCallback(() => {
    setCompanyLogo('');
  }, []);

  const renderForm = () => (
    <div className="space-y-6">
      {/* Company Information */}
      <Card>
        <CardHeader><CardTitle>Company Information</CardTitle></CardHeader>
        <CardContent className="space-y-6">
          {/* Company Logo Upload */}
          <div className="mb-6">
            <Label className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4" />
              Company Logo
            </Label>
            <div className="flex items-center space-x-4">
              {companyLogo ? (
                <div className="relative">
                  <img 
                    src={companyLogo} 
                    alt="Company Logo" 
                    className="h-20 w-auto object-contain border border-gray-200 rounded-lg"
                    style={{ maxWidth: '150px' }}
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                    onClick={removeLogo}
                  >
                    ×
                  </Button>
                </div>
              ) : (
                <div className="h-20 w-32 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs rounded-lg">
                  No Logo
                </div>
              )}
              <div className="flex flex-col space-y-2">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <Label htmlFor="logo-upload" className="cursor-pointer">
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span>
                      <FileText className="w-4 h-4 mr-2" />
                      {companyLogo ? 'Change Logo' : 'Upload Logo'}
                    </span>
                  </Button>
                </Label>
                <p className="text-xs text-gray-500">Max 5MB, PNG/JPG/JPEG</p>
              </div>
            </div>
          </div>
          
          {/* Company Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Company Name" id="company-name" value={data.company.name} onChange={(value) => updateCompany('name', value)} required />
            <FormField label="Phone" id="company-phone" value={data.company.phone} onChange={(value) => updateCompany('phone', value)} />
            <FormField label="Address" id="company-address" value={data.company.address} onChange={(value) => updateCompany('address', value)} type="textarea" rows={2} />
            <FormField label="Email" id="company-email" value={data.company.email} onChange={(value) => updateCompany('email', value)} type="email" />
          </div>
        </CardContent>
      </Card>

      {/* Employee Information */}
      <Card>
        <CardHeader><CardTitle>Employee Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Employee ID" id="employee-id" value={data.employee.employeeId} onChange={(value) => updateEmployee('employeeId', value)} required />
          <FormField label="Employee Name" id="employee-name" value={data.employee.name} onChange={(value) => updateEmployee('name', value)} required />
          <FormField label="Designation" id="employee-designation" value={data.employee.designation} onChange={(value) => updateEmployee('designation', value)} required />
          <FormField label="Department" id="employee-department" value={data.employee.department} onChange={(value) => updateEmployee('department', value)} required />
          <FormField label="Date of Joining" id="employee-joining" value={data.employee.dateOfJoining} onChange={(value) => updateEmployee('dateOfJoining', value)} type="date" required />
          <FormField label="Reporting Manager" id="employee-manager" value={data.employee.reportingManager || ''} onChange={(value) => updateEmployee('reportingManager', value)} required />
        </CardContent>
      </Card>

      {/* Appraisal Information */}
      <Card>
        <CardHeader><CardTitle>Appraisal Information</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField label="Appraisal Date" id="appraisal-date" value={data.appraisalDate} onChange={(value) => updateField('appraisalDate', value)} type="date" required />
          <FormField label="Appraisal Type" id="appraisal-type" value={data.appraisalType} onChange={(value) => updateField('appraisalType', value)} type="select" 
            options={[
              { value: 'Annual', label: 'Annual Review' },
              { value: 'Mid-Year', label: 'Mid-Year Review' },
              { value: 'Quarterly', label: 'Quarterly Review' },
              { value: 'Probation', label: 'Probation Review' }
            ]} required />
          <FormField label="Review Period Start" id="review-start" value={data.reviewPeriodStart} onChange={(value) => updateField('reviewPeriodStart', value)} type="date" required />
          <FormField label="Review Period End" id="review-end" value={data.reviewPeriodEnd} onChange={(value) => updateField('reviewPeriodEnd', value)} type="date" required />
        </CardContent>
      </Card>

      {/* Goals */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Goals and Objectives</CardTitle>
            <Button onClick={addGoal} size="sm"><Plus className="w-4 h-4 mr-2" />Add Goal</Button>
          </div>
        </CardHeader>
        <CardContent>
          {data.goals.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No goals added yet. Click Add Goal to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {data.goals.map((goal, index) => (
                <GoalCard
                  key={goal.id}
                  goal={goal}
                  index={index}
                  onUpdate={(field, value) => updateGoal(goal.id, field, value)}
                  onRemove={() => removeGoal(goal.id)}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Competencies */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Competency Ratings</CardTitle>
            <Button onClick={addCompetency} size="sm"><Plus className="w-4 h-4 mr-2" />Add Competency</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.competencies.map((competency, index) => (
              <CompetencyCard
                key={competency.id}
                competency={competency}
                index={index}
                onUpdate={(field, value) => updateCompetency(competency.id, field, value)}
                onRemove={() => removeCompetency(competency.id)}
                canRemove={data.competencies.length > 1}
              />
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="font-medium">Calculate Overall Rating:</span>
              <Button onClick={calculateOverallRating} size="sm">Calculate</Button>
            </div>
            <div className="mt-2">
              <Label>Overall Rating: {data.overallRating} - {getRatingLabel(data.overallRating)}</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Assessment Sections */}
      {[
        { title: 'Overall Assessment', fields: [
          { key: 'keyStrengths', label: 'Key Strengths' },
          { key: 'areasForImprovement', label: 'Areas for Improvement' },
          { key: 'trainingNeeds', label: 'Training Needs' }
        ]},
        { title: "Manager's Assessment", fields: [
          { key: 'managerComments', label: 'Manager Comments' }
        ]},
        { title: 'Action Plan', fields: [
          { key: 'actionPlan', label: 'Action Plan' }
        ]}
      ].map(section => (
        <Card key={section.title}>
          <CardHeader><CardTitle>{section.title}</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {section.fields.map(field => (
              <FormField
                key={field.key}
                label={field.label}
                id={field.key}
                value={data[field.key as keyof PerformanceAppraisalData] as string}
                onChange={(value) => updateField(field.key as keyof PerformanceAppraisalData, value)}
                type="textarea"
                rows={3}
              />
            ))}
            {section.title === "Manager's Assessment" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Promotion Recommendation" id="promotion-recommendation" value={data.promotionRecommendation} onChange={(value) => updateField('promotionRecommendation', value)} type="select" 
                  options={[
                    { value: 'No Change', label: 'No Change' },
                    { value: 'Promotion', label: 'Recommend for Promotion' },
                    { value: 'Lateral Move', label: 'Lateral Move' }
                  ]} />
                <FormField label="Salary Recommendation" id="salary-recommendation" value={data.salaryRecommendation} onChange={(value) => updateField('salaryRecommendation', value)} type="select" 
                  options={[
                    { value: 'No Change', label: 'No Change' },
                    { value: '5% Increase', label: '5% Increase' },
                    { value: '10% Increase', label: '10% Increase' },
                    { value: '15% Increase', label: '15% Increase' }
                  ]} />
              </div>
            )}
            {section.title === 'Action Plan' && (
              <FormField label="Follow-up Date" id="follow-up-date" value={data.followUpDate} onChange={(value) => updateField('followUpDate', value)} type="date" />
            )}
          </CardContent>
        </Card>
      ))}

      {/* Signatures */}
      <Card>
        <CardHeader><CardTitle>Signatures</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField label="Employee Sign Date" id="employee-sign-date" value={data.employeeSignDate} onChange={(value) => updateField('employeeSignDate', value)} type="date" />
          <FormField label="Manager Sign Date" id="manager-sign-date" value={data.managerSignDate} onChange={(value) => updateField('managerSignDate', value)} type="date" />
          <FormField label="HR Sign Date" id="hr-sign-date" value={data.hrSignDate} onChange={(value) => updateField('hrSignDate', value)} type="date" />
        </CardContent>
      </Card>
    </div>
  );

  const renderTemplate = () => {
    const templateProps = {
      data,
      companyLogo,
      formatDate,
      getRatingLabel
    };

    switch (selectedTemplate) {
      case 'detailed':
        return <DetailedPerformanceTemplate {...templateProps} />;
      case 'executive':
        return <ExecutivePerformanceTemplate {...templateProps} />;
      case '360':
        return <Performance360Template {...templateProps} />;
      default:
        return <ModernPerformanceTemplate {...templateProps} />;
    }
  };

  const renderPreview = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label className="text-sm font-medium">Template:</Label>
            <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {performanceTemplateOptions.map(template => (
                  <SelectItem key={template.value} value={template.value}>
                    <div>
                      <div className="font-medium">{template.label}</div>
                      <div className="text-xs text-gray-500">{template.description}</div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {renderTemplate()}
    </div>
  );

  return (
    <BaseDocumentComponent
      title="Performance Appraisal Generator"
      description="Create comprehensive performance appraisals with goals, competencies, and detailed assessments"
      documentType="quotation"
      iconColor="text-purple-600"
      data={data}
      setData={setData}
      renderForm={renderForm}
      renderPreview={renderPreview}
    />
  );
}