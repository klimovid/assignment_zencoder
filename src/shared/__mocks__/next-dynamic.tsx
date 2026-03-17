import React from "react";

type DynamicOptions = {
  loading?: () => React.ReactNode;
  ssr?: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function dynamic(
  loader: () => Promise<{ default: React.ComponentType<any> } | React.ComponentType<any>>,
  _options?: DynamicOptions,
): React.ComponentType<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let Component: React.ComponentType<any> | null = null;

  const promise = loader().then((mod) => {
    Component = "default" in mod ? mod.default : mod;
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function DynamicComponent(props: any) {
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
  return DynamicComponent;
}
