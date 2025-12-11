## Tech stack dự án

- **Kiến trúc**: Monorepo 2 phần `be/` (REST API) và `fe/` (React SPA).
- **Cơ sở dữ liệu**: MongoDB (qua Mongoose).

### Backend (`be/`)
- **Runtime**: Node.js (CommonJS).
- **Framework**: Express.
- **Bảo mật & auth**: JSON Web Token, bcryptjs (hash mật khẩu), express-validator (validate input).
- **Middleware & tiện ích**: cors, morgan (logging), dotenv (biến môi trường).
- **Phát triển**: nodemon (`npm run dev`), seed dữ liệu (`npm run seed`).

### Frontend (`fe/`)
- **UI**: React 18, Vite.
- **State**: Redux Toolkit, React Redux.
- **Routing**: React Router DOM.
- **HTTP**: Axios.
- **Styling**: Bootstrap 5, React-Bootstrap.
- **Scripts**: `npm run dev` (serve), `npm run build` (bundle), `npm run preview`.

### Triển khai & build
- Cài đặt phụ thuộc: `npm install` trong từng thư mục `be/` và `fe/`.
- Build FE bằng Vite, chạy BE bằng `node src/server.js` hoặc `npm run start`.

