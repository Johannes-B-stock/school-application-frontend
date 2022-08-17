export interface Answer {
  question: SingleDataResponse<Question>;
  answer?: string;
}

export interface SchoolApplication {
  school: {
    data: {
      id: string;
    };
  };
  id: string;
}

export interface Reference {
  name: string;
  relation: string;
  applicant: string;
  email: string;
  emailSend: boolean;
  submitted: boolean;
  answers?: ArrayDataResponse<Answer>;
}

export interface ImageDefinition {
  data: {
    id: number;
    attributes: {
      formats: {
        small: Format;
        thumbnail: Format;
      };
    };
  };
}

export interface ErrorResponse {
  status: string;
  message: string;
}

export interface Format {
  url: string;
  width: string;
  height: string;
}

export interface SchoolAttributes {
  image: ImageDefinition;
}

export interface SchoolResponse {
  id: string;
  attributes: SchoolAttributes;
}

export interface SchoolsResponse {
  data: SchoolResponse[];
}

export interface UsersResponse {
  data: User[];
}

export interface User {
  username: string;
  firstname?: string;
  lastname?: string;
  middle_names?: string;
  gender?: string;
  birthday?: string;
  address: SingleDataResponse<Address>;
}

export interface Address {
  firstname: string;
  lastname: string;
  street: string;
  number: string;
  city: string;
  country: string;
  postalCode: string;
}

export interface Application {
  reference1: SingleDataResponse<Reference>;
  reference2: SingleDataResponse<Reference>;
  user: SingleDataResponse<User>;
  answers: ArrayDataResponse<Answer>;
  step: number;
  state: "created" | "submitted" | "reviewed" | "revoked" | "approved";
}

export interface StaffApplication extends Application {
  id: string;
  arriveAt: string;
  stayUntil?: string;
}

export interface BaseData {
  createdAt: string;
  updatedAt: string;
}

export interface QuestionType extends LocaleInfo {
  name: string;
  description: string;
  order: number;
  localizations?: ArrayDataResponse<QuestionType>;
}

export interface LocaleInfo {
  locale: string;
}

export interface Question extends LocaleInfo {
  collection?: SingleDataResponse<QuestionCollection>;
  required: boolean;
  type?: SingleDataResponse<QuestionType>;
  order: number;
  inputType: "text" | "bool" | "longtext";
  question: string;
  localizations?: ArrayDataResponse<Question>;
}

export interface QuestionCollection {
  name: string;
  questions: ArrayDataResponse<Question>;
}

export interface StaffApplicationSetting extends BaseData {
  shortDescription: string;
  details: string;
  allowApplications: boolean;
  locale: string;
  cardImage: ImageDefinition;
  questions: SingleDataResponse<QuestionCollection>;
  referenceQuestions: SingleDataResponse<QuestionCollection>;
}

export interface SingleDataResponse<T> {
  data?: Data<T>;
  meta: any;
}

export interface ArrayDataResponse<T> {
  data: Data<T>[];
}

export interface Data<T> {
  id: string;
  attributes: T;
}
