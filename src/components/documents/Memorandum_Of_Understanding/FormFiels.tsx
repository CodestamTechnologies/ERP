
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const FormField = ({ label, id, value, onChange, type = 'text', placeholder = '', rows = 3, options = [] }: {
    label: string;
    id: string;
    value: string;
    onChange: (value: string) => void;
    type?: 'text' | 'email' | 'date' | 'textarea' | 'select';
    placeholder?: string;
    rows?: number;
    options?: { value: string; label: string }[];
}) => (
    <div>
        <Label htmlFor={id}>{label}</Label>
        {type === 'textarea' ? (
            <Textarea
                id={id}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
            />
        ) : type === 'select' ? (
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map(option => (
                        <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        ) : (
            <Input
                id={id}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
        )}
    </div>
);