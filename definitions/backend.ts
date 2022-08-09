export interface Answer {
  id: string;
  attributes: {
    question: {
      data: {
        attributes: {
          required: boolean;
        };
      };
    };
    answer?: string;
  };
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
  email: string;
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
}

export interface StaffApplication {
  id: string;
  arriveAt: string;
  stayUntil?: string;
}

export interface BaseData {
  createdAt: string;
  updatedAt: string;
}

export interface QuestionType {
  name: string;
  description: string;
  order: number;
}

export interface Question {
  collection: SingleDataResponse<QuestionCollection>;
  required: boolean;
  type: QuestionType;
  order: number;
  inputType: "text" | "bool" | "longtext";
  question: string;
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
}

export interface SingleDataResponse<T> {
  data: {
    id: string;
    attributes: T;
    localizations: {
      data: any[];
    };
  };
  meta: any;
}

export interface ArrayDataResponse<T> {
  data: { id: string; attributes: T }[];
}
