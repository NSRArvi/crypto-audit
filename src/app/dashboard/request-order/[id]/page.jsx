import RequestOrderDetails from "@/components/RequestOrders/RequestOrderDetails";
import Container from "@/components/shared/Container/Container";

export default async function page({ params }) {
  const { id } = await params;
  return (
    <Container>
      <RequestOrderDetails id={id} />
    </Container>
  );
}
