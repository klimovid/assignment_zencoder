import React from "react";

type DynamicOptions = {
  loading?: () => React.ReactNode;
  ssr?: boolean;
};

export default function dynamic<T extends React.ComponentType<Record<string, unknown>>>(
  loader: () => Promise<{ default: T } | T>,
  _options?: DynamicOptions,
) {
  let Component: T | null = null;

  // Eagerly resolve the import for tests
  const promise = loader().then((mod) => {
    Component = "default" in mod ? (mod as { default: T }).default : (mod as T);
  });

  function DynamicComponent(props: React.ComponentProps<T>) {
    const [, setReady] = React.useState(!!Component);

    React.useEffect(() => {
      if (!Component) {
        promise.then(() => setReady(true));
      }
    }, []);

    if (!Component) return null;
    return <Component {...props} />;
  }

  DynamicComponent.displayName = "DynamicMock";
  return DynamicComponent as unknown as T;
}
