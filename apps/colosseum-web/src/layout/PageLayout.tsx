import { type ParentProps } from "solid-js";

const PageLayout = ({ children }: ParentProps<{}>) => {
  return (
    <div class="flex flex-col justify-center items-center min-h-screen bg-gray-900">
      {children}
    </div>
  );
};

export default PageLayout;
