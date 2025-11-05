export type Comment = {
  _id: string;
  content: string;
  userId: { _id: string; name: string; email: string };
  createdAt: string;
  updatedAt?: string;
};

export type Card = {
  _id: string;
  cardName: string;
  description: string;
  dueDate?: string;
  status?: boolean;
  comments?: Comment[];
};

export type ListType = {
  _id: string;
  listName: string;
  description: string;
  status: "việc cần làm" | "đang thực hiện" | "đã xong";
  ownerCard?: Card[];
};

export type Board = {
  _id: string;
  broadName: string;
  description: string;
  ownerList: ListType[];
};

export type ListFormInputs = {
  listName: string;
  description: string;
  status: "việc cần làm" | "đang thực hiện" | "đã xong";
};

export type CommentFormInputs = {
  content: string;
};

export type User = {
  _id: string;
  name: string;
  email: string;
  username?: string;
};

export type Invitation = {
  _id: string;
  boardId: {
    _id: string;
    broadName: string;
    description: string;
  };
  inviterId: {
    _id: string;
    name?: string;
    username?: string;
    email: string;
  };
  message: string;
  createdAt: string;
  status: 'pending' | 'accepted' | 'rejected';
};