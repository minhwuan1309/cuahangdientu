import path from "./path"
import icons from "./icons"

export const navigation = [
  {
    id: 1,
    value: "TRANG CHÍNH",
    path: `/${path.HOME}`,
  },
  {
    id: 2,
    value: "SẢN PHẨM",
    path: `/${path.PRODUCTS}`,
  },
  {
    id: 3,
    value: "BLOGS",
    path: `/${path.BLOGS}`,
  },
  {
    id: 4,
    value: "FAQs",
    path: `/${path.FAQ}`,
  },
]
const { RiTruckFill, BsShieldShaded, BsReplyFill, FaTty, AiFillGift } = icons
export const productExtraInfomation = [
  {
    id: "1",
    title: "Guarantee",
    sub: "Quality Checked",
    icon: <BsShieldShaded />,
  },
  {
    id: "2",
    title: "Free Shipping",
    sub: "Free On All Products",
    icon: <RiTruckFill />,
  },
  {
    id: "3",
    title: "Special Gift Cards",
    sub: "Special Gift Cards",
    icon: <AiFillGift />,
  },
  {
    id: "4",
    title: "Free Return",
    sub: "Within 7 Days",
    icon: <BsReplyFill />,
  },
  {
    id: "5",
    title: "Consultancy",
    sub: "Lifetime 24/7/356",
    icon: <FaTty />,
  },
]

export const productInfoTabs = [
  {
    id: 1,
    name: "DISCRIPTION",
    content: `Technology: GSM / HSPA / LTE
        Dimensions: 153.8 x 75.5 x 7.6 mm
        Weight: 154 g
        Display: IPS LCD 5.5 inches
        Resolution: 720 x 1280
        OS: Android OS, v6.0 (Marshmallow)
        Chipset: Octa-core
        CPU: Octa-core
        Internal: 32 GB, 4 GB RAM
        Camera: 13MB - 20 MP`,
  },
  {
    id: 2,
    name: "WARRANTY",
    content: `WARRANTY INFORMATION
        LIMITED WARRANTIES
        Limited Warranties are non-transferable. The following Limited Warranties are given to the original retail purchaser of the following Ashley Furniture Industries, Inc.Products:
        
        Frames Used In Upholstered and Leather Products
        Limited Lifetime Warranty
        A Limited Lifetime Warranty applies to all frames used in sofas, couches, love seats, upholstered chairs, ottomans, sectionals, and sleepers. Ashley Furniture Industries,Inc. warrants these components to you, the original retail purchaser, to be free from material manufacturing defects.`,
  },
  {
    id: 3,
    name: "DELIVERY",
    content: `PURCHASING & DELIVERY
        Before you make your purchase, it’s helpful to know the measurements of the area you plan to place the furniture. You should also measure any doorways and hallways through which the furniture will pass to get to its final destination.
        Picking up at the store
        Shopify Shop requires that all products are properly inspected BEFORE you take it home to insure there are no surprises. Our team is happy to open all packages and will assist in the inspection process. We will then reseal packages for safe transport. We encourage all customers to bring furniture pads or blankets to protect the items during transport as well as rope or tie downs. Shopify Shop will not be responsible for damage that occurs after leaving the store or during transit. It is the purchaser’s responsibility to make sure the correct items are picked up and in good condition.
        Delivery
        Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
        In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
  },
  {
    id: 4,
    name: "PAYMENT",
    content: `
        Customers are able to pick the next available delivery day that best fits their schedule. However, to route stops as efficiently as possible, Shopify Shop will provide the time frame. Customers will not be able to choose a time. You will be notified in advance of your scheduled time frame. Please make sure that a responsible adult (18 years or older) will be home at that time.
        In preparation for your delivery, please remove existing furniture, pictures, mirrors, accessories, etc. to prevent damages. Also insure that the area where you would like your furniture placed is clear of any old furniture and any other items that may obstruct the passageway of the delivery team. Shopify Shop will deliver, assemble, and set-up your new furniture purchase and remove all packing materials from your home. Our delivery crews are not permitted to move your existing furniture or other household items. Delivery personnel will attempt to deliver the purchased items in a safe and controlled manner but will not attempt to place furniture if they feel it will result in damage to the product or your home. Delivery personnel are unable to remove doors, hoist furniture or carry furniture up more than 3 flights of stairs. An elevator must be available for deliveries to the 4th floor and above.`,
  },
]

export const colors = [
  "đen",
  "nâu",
  "xám",
  "trắng",
  "hồng",
  "vàng",
  "cam",
  "tím",
  "xanh lá",
  "xanh",
];

export const sorts = [
  {
    id: 1,
    value: "-sold",
    text: "Bán chạy",
  },
  {
    id: 2,
    value: "-title",
    text: " A-Z",
  },
  {
    id: 3,
    value: "title",
    text: "Z-A",
  },
  {
    id: 4,
    value: "-price",
    text: "Giá, cao - thấp ",
  },
  {
    id: 5,
    value: "price",
    text: "Giá, thấp - cao ",
  },
  {
    id: 6,
    value: "-createdAt",
    text: "Mới",
  },
  {
    id: 7,
    value: "createdAt",
    text: "Cũ",
  },
]

export const voteOptions = [
  {
    id: 1,
    text: "Rất Tệ",
  },
  {
    id: 2,
    text: "Tệ",
  },
  {
    id: 3,
    text: "Trung",
  },

  {
    id: 4,
    text: "Khá",
  },

  {
    id: 5,
    text: "Tốt",
  },
]
const { AiOutlineDashboard, MdGroups, TbBrandProducthunt, RiBillLine } = icons
export const adminSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Dashboard",
    path: `/${path.ADMIN}/${path.DASHBOARD}`,
    icon: <AiOutlineDashboard size={20} />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Quản lý account",
    path: `/${path.ADMIN}/${path.MANAGE_USER}`,
    icon: <MdGroups size={20} />,
  },
  {
    id: 3,
    type: "PARENT",
    text: "Sản phẩm",
    icon: <TbBrandProducthunt size={20} />,
    submenu: [
      {
        text: "Thêm sản phẩm mới",
        path: `/${path.ADMIN}/${path.CREATE_PRODUCTS}`,
      },
      {
        text: "Quản lý sản phẩm",
        path: `/${path.ADMIN}/${path.MANAGE_PRODUCTS}`,
      },
    ],
  },
  {
    id: 4,
    type: "SINGLE",
    text: "Quản lý đơn hàng",
    path: `/${path.ADMIN}/${path.MANAGE_ORDER}`,
    icon: <RiBillLine size={20} />,
  },
  {
    id: 5,
    type: "PARENT",
    text: "Loại sản phẩm",
    icon: <TbBrandProducthunt size={20} />,
    submenu: [
      {
        text: "Thêm loại sản phẩm",
        path: `/${path.ADMIN}/${path.CREATE_CATEGORY}`,
      },
      {
        text: "Quản lý loại sản phẩm",
        path: `/${path.ADMIN}/${path.MANAGE_CATEGORIES}`,
      },
    ],
  },
  {
    id: 31,
    type: "PARENT",
    text: "Blogs",
    icon: <TbBrandProducthunt size={20} />,
    submenu: [
      {
        text: "Tạo bài blog",
        path: `/${path.ADMIN}/${path.CREATE_BLOG}`,
      },
      {
        text: "Quản lý bài blog",
        path: `/${path.ADMIN}/${path.MANAGE_BLOGS}`,
      },
    ],
  },
];
export const memberSidebar = [
  {
    id: 1,
    type: "SINGLE",
    text: "Thông tin cá nhân",
    path: `/${path.MEMBER}/${path.PERSONAL}`,
    icon: <AiOutlineDashboard size={20} />,
  },
  {
    id: 2,
    type: "SINGLE",
    text: "Giỏ hàng",
    path: `/${path.MEMBER}/${path.MY_CART}`,
    icon: <MdGroups size={20} />,
  },
  {
    id: 4,
    type: "SINGLE",
    text: "Lịch sử mua hàng",
    path: `/${path.MEMBER}/${path.HISTORY}`,
    icon: <RiBillLine size={20} />,
  },
  {
    id: 40,
    type: "SINGLE",
    text: "Danh sách yêu thích",
    path: `/${path.MEMBER}/${path.WISHLIST}`,
    icon: <RiBillLine size={20} />,
  },
]

export const roles = [
  {
    code: 1945,
    value: "Admin",
  },
  {
    code: 1980,
    value: "Employee",
  },
  {
    code: 1979,
    value: "User",
  },
];

export const blockStatus = [
  {
    code: true,
    value: "Blocked",
  },
  {
    code: false,
    value: "Active",
  },
]
export const statusOrders = [
  {
    label: "Cancalled",
    value: "Cancalled",
  },
  {
    label: "Succeed",
    value: "Succeed",
  },
]
