import { DashboardInnerPage } from "../../pages/Dashboard/DashboardInnerPage";
import { mockBox } from "~ui/lib/Box";
import { PageWrapper } from "~ui/components/PageWrapper";

const mockMultipleUserBoxes = Array.from({ length: 4 }).map(() => mockBox());

export const DashboardPage = () => (
  <PageWrapper>
    <DashboardInnerPage userBoxes={mockMultipleUserBoxes} />
  </PageWrapper>
);
