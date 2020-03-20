export const parseConfig = ({
  PORT = '9999',
}: {
  [key: string]: string | undefined;
}) => ({
  server: {
    port: PORT,
  },
});
