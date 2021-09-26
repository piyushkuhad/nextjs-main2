function UserProfilePage(props) {
  return <h1>{props.username}</h1>;
}

export default UserProfilePage;

export async function getServerSideProps(context) {
  //the return object of this function is same as that of getStaticProps
  // - props, redirect, notFound etc. except revalidate key coz getServerSideProps as per definitions runs for
  // every incoming request

  const { params, req, res } = context;

  //console.log('Server Side code'); // this will be logged on server side and not on client side

  // console.log(req);
  // console.log(res);

  return {
    props: {
      username: 'Piyush',
    },
  };
}
