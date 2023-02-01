import {
  ArrayDataResponse,
  BaseData,
  Image,
  LocaleInfo,
  Localization,
  Pagination,
} from "./strapiBaseTypes";

export interface Answer extends BaseData {
  question: Question;
  answer?: string;
}

export interface Reference extends BaseData {
  name: string;
  relation: string;
  applicant: string;
  email: string;
  emailSend: boolean;
  submitted: boolean;
  answers?: Answer[];
  uid: string;
}

export interface ErrorResponse {
  status: string;
  message: string;
}

export interface School extends LocaleInfo, Localization<School>, BaseData {
  name: string;
  description: string;
  detailedDescription: string;
  isPublic: boolean;
  acceptingStudents: boolean;
  schoolFee: string;
  outreachFee: string;
  applicationFee: string;
  startDate: string;
  endDate: string;
  preApplicationText: string;
  secondarySchool: boolean;
  contactEmail: string;
  stripeAppFeeId: number;
  stripeSchoolFeeId: number;
  currency: string;
  image?: Image;
  staff?: User[];
  students?: User[];
  applications?: SchoolApplication[];
  referenceQuestions?: QuestionCollection;
  applicationQuestions?: QuestionCollection;
  referencesNeeded: number;
}

export interface User extends BaseData {
  username: string;
  firstname?: string;
  lastname?: string;
  email: string;
  middle_names?: string;
  gender?: "male" | "female";
  birthday?: string;
  addresses?: Address[];
  picture?: Image;
  role?: Role;
  details?: UserDetails;
  schools?: School[];
}

export interface UserDetails extends BaseData {
  phone?: string;
  mobile_phone?: string;
  nationality: string;
  native_language?: string;
  language2?: string;
  language3?: string;
  language2_skills?: string;
  language3_skills?: string;
}

export interface Role extends BaseData {
  description?: string;
  name: string;
  type: string;
}

export interface Address extends BaseData {
  id: number;
  firstname: string;
  lastname: string;
  type: "main" | "emergency" | "secondary" | "old";
  street: string;
  number: string;
  city: string;
  country?: string;
  postalCode: number;
}

export interface Application extends BaseData {
  references?: Reference[];
  user: User;
  answers: Answer[];
  step: number;
  state: ApplicationState;
  submittedAt?: string;
}

export type ApplicationState =
  | "created"
  | "submitted"
  | "reviewed"
  | "revoked"
  | "approved"
  | "reviewing";

export interface SchoolApplication extends Application {
  school: School;
  applicationFeePaid: boolean;
}

export interface StaffApplication extends Application {
  arriveAt?: string;
  stayUntil?: string;
}

export interface QuestionType extends Localization<QuestionType> {
  name: string;
  description: string;
  order: number;
}

export interface GetAllStaffResponse {
  staff: User[];
  pagination?: Pagination;
}

export interface Question extends BaseData, Localization<Question> {
  collection?: QuestionCollection;
  required: boolean;
  type?: QuestionType;
  order: number;
  inputType: "text" | "bool" | "longtext";
  question: string;
}

export interface QuestionCollection extends BaseData {
  name: string;
  questions: Question[];
}

export interface StaffApplicationSetting
  extends BaseData,
    Localization<StaffApplicationSetting> {
  shortDescription: string;
  details: string;
  allowApplications: boolean;
  locale: string;
  cardImage: Image;
  applicationQuestions: QuestionCollection;
  referenceQuestions: QuestionCollection;
  referencesNeeded: number;
}

export interface PageContentData
  extends BaseData,
    Localization<PageContentData> {
  showcaseTitle?: string;
  showcaseSubtitle?: string;
  showcase?: Image;
  contact?: string;
  facebookLink?: string;
  twitterLink?: string;
  tiktokLink?: string;
  instagramLink?: string;
  navbar_brand: Image;
  pageTitle: string;
  pageDescription: string;
  pageKeywords: string;
  footerText?: string;
}

export interface AboutPage {
  content: string;
}

export interface Imprint {
  content: string;
}

export interface Privacy {
  content: string;
}
