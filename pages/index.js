import path from 'path';
import fs from 'fs';

import Link from 'next/link';

function HomePage(props) {
  const { products } = props;
  return (
    <ul>
      {products.map((product) => (
        <li key={product.id}>
          <Link href={`/products/${product.id}`}>{product.title}</Link>
        </li>
      ))}
    </ul>
  );
}

//Next js will first execute this function and then HomePage function above
export async function getStaticProps() {
  console.log('Re-Generating...');
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  //CWD - current workng directory that is the overall project folder nxt2, 2nd arg is folder name and 3rd is file name
  const jsonData = await fs.promises.readFile(filePath);
  const data = JSON.parse(jsonData);

  if (!data) {
    return {
      redirect: {
        destination: '/no-data',
      },
    };
  }

  if (data.products.length === 0) {
    return { notFound: true };
  }

  //Always return object with props key
  return {
    props: {
      products: data.products,
    },
    revalidate: 10, //(time in seconds) also this features matters in prod but in dev env it will be re-generated every time

    // notFound: true //Shows Error page
    // redirect: {} //Allows to redirect the user
  };
}

export default HomePage;
