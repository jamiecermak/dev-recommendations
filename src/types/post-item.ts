export interface PostItem {
  id: string;
  title: string;
  description: string;
  teamId: string;
  teamName: string;
  href: string;
  createdByUserFirstName: string;
  createdByUserLastName: string;
  createdAt: Date;
  tags: {
    id: string;
    name: string;
  }[];
  postType: {
    id: string;
    name: string;
  };
}
