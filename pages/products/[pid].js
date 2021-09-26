import path from 'path';
import fs from 'fs';
import { Fragment } from 'react';

function ProductDetailPage(props) {
  const { loadedProduct } = props;

  //Do this to prevent getting an error when fallback is true and you visit 'p3' product page directly from url
  if (!loadedProduct) {
    return <p>Loading...</p>;
  }

  return (
    <Fragment>
      <h1>{loadedProduct.title}</h1>
      <p>{loadedProduct.description}</p>
    </Fragment>
  );
}

async function getData() {
  const filePath = path.join(process.cwd(), 'data', 'dummy-backend.json');
  const jsonData = await fs.promises.readFile(filePath);
  const data = JSON.parse(jsonData);

  return data;
}

//The goal of this fn is to tell next.js which instances of this dynamic page should be generated
export async function getStaticPaths() {
  const data = await getData();

  const ids = data.products.map((product) => product.id);
  const pathsWithParams = ids.map((id) => ({ params: { pid: id } }));

  return {
    paths: pathsWithParams,

    // paths: [
    //   //contains different dynamic segment identifiers
    //   //{ params: { pid: 'p1' } },

    //   // { params: { pid: 'p2' } },
    //   // { params: { pid: 'p3' } },
    // ],
    //fallback: true, //If this is true then you can pre-generate some pages For ex- only pass pid: 'p1' above
    //So if you visit 'p3' then it's page will be generated Just-in Time and not pre-generated

    //fallback: 'blocking', //now we don't need to show "Loading" text
    // in this next.js will fully wait for server to generate page and then serve that page only when data is fully loaded
    //therefore it can take little bit longer to get that page nut the response which will be sent will be finished

    //Now since above we are loading all the ids again then set fallback to false again
    // fallback: false,

    //Now set Fallback to true since we have to show 404 page incase product does not exist
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const { params } = context;
  const productId = params.pid;

  const data = await getData();
  const product = data.products.find((product) => product.id === productId);

  //If Product does not exist show error page
  if (!product) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      loadedProduct: product,
    },
  };
}

export default ProductDetailPage;
