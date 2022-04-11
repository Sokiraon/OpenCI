import { useContext, useEffect } from "react";
import { TitleContext } from "../components/Layout";

export default function useBarTitle(title: string) {
  const context = useContext(TitleContext);
  useEffect(() => {
    context.setTitle(title);
  }, [context, title]);
}
