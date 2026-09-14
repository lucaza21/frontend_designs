export default function DentalClinicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <link
        href="https://db.onlinewebfonts.com/c/1cd1e7d71e048159076fd90b39846902?family=Open+Sauce+One"
        rel="stylesheet"
      />
      <link
        href="https://db.onlinewebfonts.com/c/42acf9aa4a6dc2f2886a3f682e337ead?family=Open+Sauce+One+Bold"
        rel="stylesheet"
      />
      {children}
    </>
  );
}
