import { Skeleton, Typography, TypographyProps } from "@mui/material";
import React from "react";

interface TextSkeletonProps extends TypographyProps {
  content: string | undefined;
}

export default function TextSkeleton(props: TextSkeletonProps) {
  const { content, ...others } = props;

  return (
    <Typography {...others}>
      {content ? content : <Skeleton />}
    </Typography>
  );
}
