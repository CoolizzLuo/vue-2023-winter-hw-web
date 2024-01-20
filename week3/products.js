import { createApp, ref, onMounted } from 'https://unpkg.com/vue@3/dist/vue.esm-browser.js';

let productModal = null;
let delProductModal = null;

createApp({
  setup() {
    const products = ref([]);
    const isCreate = ref(false);
    const tempProduct = ref({ imagesUrl: [] });

    const openModal = (action, item) => {
      if (action === 'create') {
        tempProduct.value = {
          imagesUrl: [],
        };
        isCreate.value = true;
        productModal.show();
      } else if (action === 'edit') {
        tempProduct.value = { ...item };
        isCreate.value = false;
        productModal.show();
      } else if (action === 'delete') {
        tempProduct.value = { ...item };
        delProductModal.show();
      }
    };

    const handleGetProducts = async () => {
      const res = await apiService.getProducts();
      products.value = res.data.products;
    };

    const handleCreate = async () => {
      await apiService.createProduct(tempProduct.value);
      productModal.hide();

      await handleGetProducts();
    };
    const handleUpdate = async () => {
      await apiService.updateProduct(tempProduct.value);
      productModal.hide();

      await handleGetProducts();
    };
    const handleDelete = async () => {
      await apiService.deleteProduct(tempProduct.value.id);
      delProductModal.hide();

      await handleGetProducts();
    };

    const createImages = () => {
      tempProduct.value.imagesUrl = [];
      tempProduct.value.imagesUrl.push('');
    };

    onMounted(() => {
      productModal = new bootstrap.Modal(document.getElementById('productModal'), {
        keyboard: false,
      });

      delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'), {
        keyboard: false,
      });
      apiService.checkAdmin().then(() => handleGetProducts());
    });

    return {
      products,
      isCreate,
      tempProduct,
      openModal,
      createImages,
      handleCreate,
      handleUpdate,
      handleDelete,
    };
  },
}).mount('#app');
