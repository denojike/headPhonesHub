// //contentful connect
// const client = contentful.createClient({
//   space: "68x4dwiyco8j",
//   accessToken: "3-YQP_PRVfEmCdz1N-NyvkLNab_TNVwBGt_01VrzGbc"
// });

// class Products {
//   async getProducts() {
//     // try {
//     //   let result = await fetch("products.json");
//     //   let data = await result.json();
//     //   const products = data.items.map(item => {
//     //     const { id } = item.sys;
//     //     const { title } = item.fields;
//     //     const { price } = item.fields;
//     //     const image = item.fields.image.fields.file.url;
//     //     return { id, title, price, image };
//     //   });
//     //   return products;

//     try {
//       let contentful = await client.getEntries({
//         content_type: "headPhonesHub"
//       });
//       let products = contentful.items;
//       products = products.map(item => {
//         const { id } = item.sys;
//         const { title } = item.fields;
//         const { price } = item.fields;
//         const image = item.fields.image;
//         return { id, title, price, image };
//         //   const image = item.fields.image.fields.file.url;
//       });
//       return products;
//     } catch (error) {
//       console.log(error);
//     }
//   }
// }

// const products = new Products();

// products.getProducts().then(pro => console.log(pro));
