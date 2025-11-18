import * as Yup from 'yup';
import { SiteDiary } from '@/app/api/graphql+api';

export interface SiteDiaryFormValues {
  date: string;
  title: string;
  content?: string;
  weatherCondition?: string;
  temperature?: string;
  attendees: string[];
  attachments: string[];
}

export const siteDiaryValidationSchema = Yup.object().shape({
  date: Yup.string()
    .required('Date is required')
    .matches(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  title: Yup.string()
    .required('Title is required')
    .min(1, 'Title cannot be empty')
    .max(200, 'Title must be less than 200 characters'),
  content: Yup.string().max(5000, 'Content must be less than 5000 characters'),
  weatherCondition: Yup.string().max(100, 'Weather condition must be less than 100 characters'),
  temperature: Yup.string()
    .matches(/^-?\d+$/, 'Temperature must be a valid number')
    .test('temperature-range', 'Temperature must be between -50 and 60', (value) => {
      if (!value) return true; // Optional field
      const num = parseInt(value, 10);
      return !isNaN(num) && num >= -50 && num <= 60;
    }),
  attendees: Yup.array()
    .of(Yup.string().min(1, 'Attendee name cannot be empty').max(100, 'Attendee name too long'))
    .max(50, 'Maximum 50 attendees allowed')
    .optional(),
  attachments: Yup.array()
    .of(Yup.string().required('Attachment URI is required'))
    .max(20, 'Maximum 20 attachments allowed')
    .optional(),
});

export const getInitialValues = (): SiteDiaryFormValues => ({
  date: new Date().toISOString().split('T')[0],
  title: '',
  content: '',
  weatherCondition: 'Sunny',
  temperature: '24',
  attendees: [],
  attachments: [],
});
