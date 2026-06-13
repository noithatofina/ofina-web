/**
 * Programmatic SEO — Bộ sưu tập (collections).
 *
 * Mỗi collection là một landing page nhắm vào cụm từ khoá thương mại mà khách
 * thật sự tìm ("ghế giám đốc cao cấp", "ghế công thái học", "ghế văn phòng giá
 * rẻ"...). Trang gom sản phẩm từ nhiều danh mục liên quan + lọc giá, kèm nội
 * dung giới thiệu riêng + FAQ → KHÔNG phải doorway page mỏng.
 *
 * Route: /bo-suu-tap/[slug]
 *
 * Quy tắc tránh thin content: chỉ định nghĩa collection có ≥ ~10 sản phẩm thật
 * (đã kiểm tra count trước khi thêm). Trang nào ra < MIN_PRODUCTS sẽ 404.
 */

export const MIN_PRODUCTS = 3

export interface CollectionFilter {
  categorySlugs: string[]
  priceMin?: number
  priceMax?: number
  isBestseller?: boolean
}

export interface CollectionFaq {
  q: string
  a: string
}

export interface CollectionDef {
  slug: string
  /** H1 + tên hiển thị */
  name: string
  /** <title> — nếu bỏ trống dùng name */
  title?: string
  metaDescription: string
  /** Đoạn giới thiệu SEO (HTML đơn giản: <p>, <ul>, <strong>) */
  intro: string
  faqs: CollectionFaq[]
  filter: CollectionFilter
  /** newest | price-asc | price-desc | bestseller */
  sort?: string
}

const HOTLINE = '0325669996'

export const COLLECTIONS: CollectionDef[] = [
  {
    slug: 'ghe-giam-doc-cao-cap',
    name: 'Ghế giám đốc cao cấp',
    title: 'Ghế giám đốc cao cấp — da thật, lưng cao | OFINA',
    metaDescription:
      'Bộ sưu tập ghế giám đốc cao cấp tại OFINA: ghế da thật, lưng cao, ngả tựa, chân hợp kim. Đẳng cấp lãnh đạo, bảo hành 24 tháng, giao lắp tận nơi. Hotline ' +
      HOTLINE,
    intro:
      '<p><strong>Ghế giám đốc cao cấp</strong> là điểm nhấn thể hiện đẳng cấp và gu thẩm mỹ của người lãnh đạo. OFINA tuyển chọn các mẫu ghế giám đốc bọc da thật, da công nghiệp cao cấp, lưng cao nâng đỡ toàn thân, cơ chế ngả tựa và tựa đầu êm ái — phù hợp cho phòng làm việc giám đốc, chủ tịch, phòng họp lãnh đạo.</p>' +
      '<p>Mọi sản phẩm đều <strong>chính hãng, có hoá đơn VAT</strong>, bảo hành 24 tháng, miễn phí giao và lắp đặt tại Hà Nội & TP.HCM. Đội ngũ OFINA tư vấn chọn ghế theo chiều cao, cân nặng và phong cách nội thất phòng của bạn.</p>',
    faqs: [
      {
        q: 'Ghế giám đốc cao cấp giá bao nhiêu?',
        a: 'Ghế giám đốc cao cấp tại OFINA có nhiều phân khúc, từ khoảng 3–5 triệu cho dòng phổ thông đến trên 20 triệu cho ghế da thật nhập khẩu. Liên hệ ' + HOTLINE + ' để được tư vấn mẫu phù hợp ngân sách.',
      },
      {
        q: 'Ghế giám đốc OFINA bọc da thật hay da công nghiệp?',
        a: 'OFINA có cả hai dòng. Da thật mềm, thoáng, bền và sang trọng hơn; da công nghiệp (PU/microfiber) cao cấp có giá hợp lý và dễ vệ sinh. Thông tin chất liệu ghi rõ trong từng sản phẩm.',
      },
      {
        q: 'Bảo hành ghế giám đốc bao lâu?',
        a: 'Hầu hết ghế giám đốc tại OFINA được bảo hành 24 tháng cho khung, cơ chế ngả và piston nâng hạ.',
      },
    ],
    filter: { categorySlugs: ['ghe-da-giam-doc', 'ghe-lanh-dao', 'ghe-chu-toa'] },
    sort: 'price-desc',
  },
  {
    slug: 'ghe-cong-thai-hoc',
    name: 'Ghế công thái học (ergonomic)',
    title: 'Ghế công thái học ergonomic — chống đau lưng | OFINA',
    metaDescription:
      'Ghế công thái học (ergonomic) lưới thoáng, tựa lưng nâng đỡ cột sống, kê tay điều chỉnh. Giảm đau lưng, mỏi vai gáy khi ngồi lâu. Bảo hành 24 tháng tại OFINA.',
    intro:
      '<p><strong>Ghế công thái học (ergonomic)</strong> được thiết kế nâng đỡ đường cong tự nhiên của cột sống, giúp giảm đau lưng, mỏi vai gáy khi ngồi làm việc nhiều giờ. Bộ sưu tập tại OFINA tập trung các mẫu lưng lưới thoáng khí, tựa lưng và kê tay điều chỉnh, cơ chế ngả đồng bộ — lựa chọn lý tưởng cho dân văn phòng, lập trình viên và người làm việc tại nhà.</p>' +
      '<p>Ngồi đúng tư thế trên ghế ergonomic giúp bảo vệ sức khoẻ lâu dài và tăng năng suất. OFINA tư vấn chọn ghế theo chiều cao, cân nặng và thời lượng ngồi của bạn, bảo hành 24 tháng, giao lắp tận nơi.</p>',
    faqs: [
      {
        q: 'Ghế công thái học có thật sự giảm đau lưng không?',
        a: 'Có. Ghế ergonomic nâng đỡ thắt lưng (lumbar support) và giữ cột sống ở đường cong tự nhiên, kết hợp ngồi đúng tư thế sẽ giảm đáng kể tình trạng đau lưng, mỏi cổ vai gáy khi ngồi lâu.',
      },
      {
        q: 'Nên chọn ghế lưới hay ghế đệm cho công thái học?',
        a: 'Ghế lưới thoáng khí, mát, phù hợp khí hậu nóng và ngồi lâu. Ghế đệm êm ái hơn nhưng nóng hơn. Tuỳ nhu cầu, OFINA có cả hai dòng.',
      },
      {
        q: 'Ghế công thái học giá rẻ có tốt không?',
        a: 'Phân khúc phổ thông (2–4 triệu) đã có đủ tính năng cơ bản: tựa lưng nâng đỡ, kê tay, ngả tựa. Mẫu cao cấp bổ sung tựa đầu, kê tay 4D và cơ chế ngả đa điểm.',
      },
    ],
    filter: { categorySlugs: ['ghe-xoay-luoi', 'ghe-xoay-lung-trung', 'ghe-chan-quy-luoi'] },
    sort: 'newest',
  },
  {
    slug: 'ghe-van-phong-gia-re',
    name: 'Ghế văn phòng giá rẻ dưới 2 triệu',
    title: 'Ghế văn phòng giá rẻ dưới 2 triệu — chính hãng | OFINA',
    metaDescription:
      'Ghế văn phòng giá rẻ dưới 2 triệu tại OFINA: ghế xoay, ghế lưới, ghế nhân viên bền đẹp, chính hãng, bảo hành 24 tháng. Phù hợp trang bị số lượng lớn.',
    intro:
      '<p><strong>Ghế văn phòng giá rẻ dưới 2 triệu</strong> là lựa chọn hợp lý để trang bị cho nhân viên, văn phòng startup hoặc góc làm việc tại nhà với ngân sách tiết kiệm. OFINA chọn lọc các mẫu ghế xoay, ghế lưới bền đẹp, kiểu dáng hiện đại nhưng giá phải chăng.</p>' +
      '<p>Dù giá tốt, mọi sản phẩm vẫn <strong>chính hãng, bảo hành 24 tháng</strong>. Mua số lượng lớn cho văn phòng được hỗ trợ báo giá ưu đãi và giao lắp tận nơi — liên hệ ' + HOTLINE + '.</p>',
    faqs: [
      {
        q: 'Ghế văn phòng giá rẻ có bền không?',
        a: 'Các mẫu dưới 2 triệu tại OFINA đều được chọn lọc về độ bền khung và piston, bảo hành 24 tháng. Phù hợp sử dụng văn phòng hằng ngày.',
      },
      {
        q: 'Mua nhiều ghế cho công ty có được giảm giá không?',
        a: 'Có. OFINA có chính sách báo giá ưu đãi cho đơn số lượng lớn (B2B). Liên hệ ' + HOTLINE + ' hoặc trang Báo giá B2B để được hỗ trợ.',
      },
    ],
    filter: {
      categorySlugs: ['ghe-xoay-van-phong', 'ghe-xoay-lung-trung', 'ghe-xoay-luoi', 'ghe-chan-quy-luoi'],
      priceMax: 2000000,
    },
    sort: 'price-asc',
  },
  {
    slug: 'ghe-xoay-van-phong',
    name: 'Ghế xoay văn phòng',
    metaDescription:
      'Ghế xoay văn phòng đa dạng mẫu mã tại OFINA: ghế xoay lưới, ghế xoay da, lưng trung, có tay vịn. Bền, êm, bảo hành 24 tháng, giao lắp tận nơi.',
    intro:
      '<p><strong>Ghế xoay văn phòng</strong> là dòng ghế thông dụng nhất cho mọi vị trí làm việc nhờ khả năng xoay linh hoạt, nâng hạ độ cao và di chuyển bằng bánh xe. OFINA cung cấp đa dạng mẫu: ghế xoay lưới thoáng, ghế xoay da lịch sự, lưng trung gọn gàng — phù hợp nhân viên, trưởng nhóm đến quản lý.</p>' +
      '<p>Tất cả đều chính hãng, bảo hành 24 tháng, miễn phí giao lắp nội thành Hà Nội & TP.HCM.</p>',
    faqs: [
      {
        q: 'Ghế xoay văn phòng loại nào tốt nhất?',
        a: 'Tuỳ nhu cầu: ghế xoay lưới mát và thoáng cho ngồi lâu, ghế xoay da sang trọng cho quản lý, lưng trung gọn gàng cho không gian nhỏ.',
      },
      {
        q: 'Piston ghế xoay có an toàn không?',
        a: 'Ghế tại OFINA dùng piston đạt chuẩn an toàn, được bảo hành 24 tháng. Hãy chọn đúng tải trọng phù hợp cân nặng người dùng.',
      },
    ],
    filter: { categorySlugs: ['ghe-xoay-van-phong', 'ghe-xoay-da', 'ghe-xoay-lung-trung'] },
    sort: 'newest',
  },
  {
    slug: 'ban-giam-doc-cao-cap',
    name: 'Bàn giám đốc cao cấp',
    title: 'Bàn giám đốc cao cấp — gỗ tự nhiên, chân sắt | OFINA',
    metaDescription:
      'Bàn giám đốc cao cấp tại OFINA: bàn lãnh đạo gỗ tự nhiên, chân sắt hiện đại, mặt rộng, đẳng cấp. Bảo hành 24 tháng, giao lắp tận nơi. Hotline ' + HOTLINE,
    intro:
      '<p><strong>Bàn giám đốc cao cấp</strong> tạo nên không gian làm việc uy nghi, chuyên nghiệp cho lãnh đạo doanh nghiệp. OFINA quy tụ các mẫu bàn giám đốc, bàn lãnh đạo với mặt bàn rộng rãi, thiết kế từ gỗ công nghiệp phủ veneer/melamine cao cấp đến chân sắt hiện đại, tích hợp hộc tủ tiện dụng.</p>' +
      '<p>Sản phẩm chính hãng, hoá đơn VAT đầy đủ, bảo hành 24 tháng, giao và lắp đặt tận nơi tại Hà Nội & TP.HCM.</p>',
    faqs: [
      {
        q: 'Bàn giám đốc nên chọn kích thước bao nhiêu?',
        a: 'Phổ biến từ 1m6–2m4 tuỳ diện tích phòng. Phòng giám đốc rộng nên chọn bàn 1m8–2m2 để tạo sự bề thế. OFINA tư vấn kích thước theo mặt bằng của bạn.',
      },
      {
        q: 'Bàn giám đốc gỗ tự nhiên hay gỗ công nghiệp tốt hơn?',
        a: 'Gỗ tự nhiên sang trọng, bền nhưng giá cao. Gỗ công nghiệp phủ veneer/melamine cao cấp có vẻ đẹp tương đương, chống ẩm cong vênh tốt và giá hợp lý hơn.',
      },
    ],
    filter: { categorySlugs: ['ban-giam-doc', 'ban-lanh-dao', 'ban-giam-doc-chan-sat'] },
    sort: 'price-desc',
  },
  {
    slug: 'ban-hop-van-phong',
    name: 'Bàn họp văn phòng',
    metaDescription:
      'Bàn họp văn phòng tại OFINA: bàn họp lớn, bàn họp gỗ công nghiệp, chân sắt, nhiều kích thước cho 6–20 người. Chính hãng, bảo hành 24 tháng, giao lắp tận nơi.',
    intro:
      '<p><strong>Bàn họp văn phòng</strong> là trung tâm của mọi cuộc họp và thảo luận. OFINA cung cấp đa dạng bàn họp: bàn họp lớn cho phòng họp 10–20 người, bàn họp gỗ công nghiệp, bàn họp chân sắt hiện đại — nhiều kích thước, kiểu dáng phù hợp từng quy mô doanh nghiệp.</p>' +
      '<p>Tất cả chính hãng, bảo hành 24 tháng, hỗ trợ tư vấn bố trí phòng họp và giao lắp tận nơi.</p>',
    faqs: [
      {
        q: 'Bàn họp cho 10 người nên dài bao nhiêu?',
        a: 'Bàn họp 10 người thường dài khoảng 2m4–3m. Mỗi người cần ~60–70cm chiều dài bàn để ngồi thoải mái. OFINA tư vấn theo số người và diện tích phòng.',
      },
      {
        q: 'Bàn họp có module ghép được không?',
        a: 'Một số mẫu bàn họp tại OFINA thiết kế module, ghép linh hoạt theo nhu cầu. Liên hệ ' + HOTLINE + ' để được tư vấn giải pháp phù hợp.',
      },
    ],
    filter: { categorySlugs: ['ban-hop-lon', 'ban-hop-van-phong-cao-cap', 'ban-hop-go-cong-nghiep', 'ban-hop-chan-go'] },
    sort: 'newest',
  },
  {
    slug: 'noi-that-phong-giam-doc',
    name: 'Trọn bộ nội thất phòng giám đốc',
    title: 'Nội thất phòng giám đốc trọn bộ — bàn, ghế, tủ | OFINA',
    metaDescription:
      'Trọn bộ nội thất phòng giám đốc tại OFINA: bàn giám đốc, ghế da lãnh đạo, tủ tài liệu đồng bộ. Thiết kế đẳng cấp, tư vấn setup trọn gói, bảo hành 24 tháng.',
    intro:
      '<p>Một <strong>phòng giám đốc đẳng cấp</strong> cần sự đồng bộ giữa bàn làm việc, ghế ngồi và tủ tài liệu. OFINA gom trọn các sản phẩm cho phòng lãnh đạo: bàn giám đốc bề thế, ghế da lãnh đạo sang trọng, tủ giám đốc lưu trữ tài liệu — giúp bạn dễ dàng phối thành không gian thống nhất, chuyên nghiệp.</p>' +
      '<p>OFINA hỗ trợ <strong>tư vấn setup trọn gói</strong> theo phong cách và diện tích phòng, báo giá combo ưu đãi, giao lắp tận nơi và bảo hành 24 tháng.</p>',
    faqs: [
      {
        q: 'Mua trọn bộ nội thất phòng giám đốc có được giảm giá không?',
        a: 'Có. OFINA có báo giá combo ưu đãi khi mua đồng bộ bàn + ghế + tủ. Liên hệ ' + HOTLINE + ' để được tư vấn và báo giá trọn gói.',
      },
      {
        q: 'OFINA có tư vấn thiết kế phòng giám đốc không?',
        a: 'Có. Đội ngũ OFINA tư vấn phối màu, bố trí và chọn sản phẩm đồng bộ theo diện tích, phong cách và ngân sách của bạn.',
      },
    ],
    filter: { categorySlugs: ['ban-giam-doc', 'ghe-da-giam-doc', 'tu-giam-doc', 'ban-lanh-dao', 'ghe-lanh-dao'] },
    sort: 'price-desc',
  },
  {
    slug: 'setup-phong-hop',
    name: 'Trọn bộ nội thất phòng họp',
    title: 'Nội thất phòng họp trọn bộ — bàn họp & ghế | OFINA',
    metaDescription:
      'Setup phòng họp trọn bộ tại OFINA: bàn họp lớn kết hợp ghế phòng họp, ghế chân quỳ đồng bộ. Tư vấn bố trí, báo giá combo, bảo hành 24 tháng, giao lắp tận nơi.',
    intro:
      '<p><strong>Setup phòng họp chuyên nghiệp</strong> cần bàn họp và ghế đồng bộ, phù hợp số lượng người và diện tích. OFINA gom trọn bộ sản phẩm cho phòng họp: bàn họp lớn nhiều kích thước cùng ghế phòng họp, ghế chân quỳ êm ái, tạo không gian họp lịch sự và hiệu quả.</p>' +
      '<p>OFINA tư vấn bố trí phòng họp tối ưu, báo giá combo ưu đãi cho doanh nghiệp, giao lắp tận nơi và bảo hành 24 tháng.</p>',
    faqs: [
      {
        q: 'Phòng họp 12 người cần bàn và bao nhiêu ghế?',
        a: 'Phòng họp 12 người cần bàn dài ~3m và 12 ghế. Nên chọn ghế chân quỳ hoặc ghế phòng họp cùng tông màu với bàn để đồng bộ.',
      },
      {
        q: 'Nên chọn ghế xoay hay ghế chân quỳ cho phòng họp?',
        a: 'Ghế chân quỳ gọn, sang và ít chiếm diện tích, phù hợp phòng họp tiêu chuẩn. Ghế xoay linh hoạt hơn, phù hợp phòng họp kiêm làm việc.',
      },
    ],
    filter: { categorySlugs: ['ban-hop-lon', 'ghe-phong-hop-chan-dung', 'ghe-chan-quy', 'ghe-chan-quy-da'] },
    sort: 'newest',
  },
  {
    slug: 'goc-lam-viec-tai-nha',
    name: 'Góc làm việc tại nhà (Home Office)',
    title: 'Nội thất góc làm việc tại nhà — bàn & ghế | OFINA',
    metaDescription:
      'Trang bị góc làm việc tại nhà với OFINA: bàn nâng hạ thông minh, bàn làm việc nhỏ gọn, ghế công thái học. Tiện nghi, tiết kiệm diện tích, bảo hành 24 tháng.',
    intro:
      '<p>Làm việc tại nhà hiệu quả bắt đầu từ một <strong>góc làm việc tiện nghi</strong>. OFINA tuyển chọn các sản phẩm lý tưởng cho home office: bàn nâng hạ thông minh đứng/ngồi linh hoạt, bàn làm việc nhỏ gọn, ghế công thái học nâng đỡ cột sống — giúp bạn thoải mái và tập trung suốt ngày dài.</p>' +
      '<p>Sản phẩm chính hãng, kiểu dáng hiện đại, tiết kiệm diện tích, bảo hành 24 tháng và giao lắp tận nơi.</p>',
    faqs: [
      {
        q: 'Bàn nâng hạ có thật sự cần cho làm việc tại nhà?',
        a: 'Bàn nâng hạ cho phép luân phiên đứng/ngồi, giảm mỏi lưng và tăng tuần hoàn máu khi làm việc lâu. Rất đáng đầu tư nếu bạn ngồi nhiều giờ mỗi ngày.',
      },
      {
        q: 'Góc làm việc nhỏ nên chọn bàn kích thước nào?',
        a: 'Với không gian hẹp, bàn 1m–1m2 là vừa đủ cho laptop/màn hình và vật dụng. OFINA có nhiều mẫu nhỏ gọn phù hợp căn hộ.',
      },
    ],
    filter: {
      categorySlugs: ['ban-nang-ha-thong-minh', 'ban-nang-ha-2-motor', 'ban-lam-viec-chan-sat', 'ban-lam-viec-chan-go', 'ghe-xoay-luoi'],
    },
    sort: 'newest',
  },
  {
    slug: 'tu-ho-so-van-phong',
    name: 'Tủ hồ sơ & tủ tài liệu văn phòng',
    metaDescription:
      'Tủ hồ sơ, tủ tài liệu văn phòng tại OFINA: tủ cao, tủ giám đốc, hộc di động, tủ locker. Lưu trữ gọn gàng, chắc chắn, bảo hành 24 tháng, giao lắp tận nơi.',
    intro:
      '<p><strong>Tủ hồ sơ và tủ tài liệu</strong> giúp văn phòng lưu trữ giấy tờ gọn gàng, khoa học và bảo mật. OFINA cung cấp đa dạng: tủ tài liệu cao, tủ giám đốc, hộc di động đặt gầm bàn, tủ locker cá nhân — nhiều chất liệu gỗ và sắt, phù hợp mọi không gian.</p>' +
      '<p>Sản phẩm chắc chắn, chính hãng, bảo hành 24 tháng và giao lắp tận nơi tại Hà Nội & TP.HCM.</p>',
    faqs: [
      {
        q: 'Nên chọn tủ hồ sơ gỗ hay tủ sắt?',
        a: 'Tủ gỗ ấm áp, hợp không gian sang trọng; tủ sắt bền, chống cháy tốt và phù hợp lưu trữ khối lượng lớn. Tuỳ nhu cầu và phong cách văn phòng.',
      },
      {
        q: 'Hộc di động để làm gì?',
        a: 'Hộc di động (tủ phụ) đặt dưới gầm bàn làm việc, có bánh xe, dùng lưu trữ tài liệu và vật dụng cá nhân tiện lấy.',
      },
    ],
    filter: { categorySlugs: ['tu-ho-so-cao', 'tu-giam-doc', 'hoc-di-dong-tu-phu', 'tu-locker-go'] },
    sort: 'newest',
  },
  {
    slug: 'cum-ban-lam-viec-nhan-vien',
    name: 'Cụm bàn làm việc nhân viên',
    title: 'Cụm bàn làm việc nhân viên 3–8 người | OFINA',
    metaDescription:
      'Cụm bàn làm việc nhân viên 3, 4, 8 người tại OFINA: thiết kế tối ưu không gian mở, vách ngăn, đi dây gọn gàng. Báo giá theo số chỗ ngồi, bảo hành 24 tháng.',
    intro:
      '<p><strong>Cụm bàn làm việc nhân viên</strong> là giải pháp tối ưu cho văn phòng không gian mở, giúp bố trí nhiều chỗ ngồi gọn gàng, tiết kiệm diện tích và chi phí. OFINA cung cấp cụm bàn 3, 4, 8 người với vách ngăn, hệ đi dây điện ngăn nắp và thiết kế hiện đại.</p>' +
      '<p>OFINA báo giá theo số chỗ ngồi, tư vấn bố trí mặt bằng tối ưu, giao lắp tận nơi và bảo hành 24 tháng.</p>',
    faqs: [
      {
        q: 'Mỗi nhân viên cần bao nhiêu diện tích bàn làm việc?',
        a: 'Mỗi chỗ ngồi thường rộng 1m2–1m4. Cụm bàn giúp dùng chung chân và vách ngăn nên tiết kiệm hơn so với bàn rời.',
      },
      {
        q: 'Cụm bàn có vách ngăn riêng tư không?',
        a: 'Có. Nhiều mẫu cụm bàn OFINA tích hợp vách ngăn nỉ/kính tạo sự riêng tư và giảm ồn giữa các vị trí.',
      },
    ],
    filter: {
      categorySlugs: ['cum-ban-lam-viec', 'cum-ban-lam-viec-3-nguoi', 'cum-ban-lam-viec-4-nguoi', 'cum-ban-lam-viec-8-nguoi', 'cum-ban-lam-viec-15-nguoi'],
    },
    sort: 'newest',
  },
  {
    slug: 'ghe-phong-cho-le-tan',
    name: 'Ghế phòng chờ & quầy lễ tân',
    metaDescription:
      'Ghế phòng chờ, ghế quầy lễ tân tại OFINA: băng chờ, ghế phòng chờ chân xoay, bền đẹp, dễ vệ sinh. Phù hợp sảnh, phòng khám, văn phòng. Bảo hành 24 tháng.',
    intro:
      '<p><strong>Ghế phòng chờ và quầy lễ tân</strong> tạo ấn tượng đầu tiên với khách đến văn phòng, sảnh công ty, phòng khám hay ngân hàng. OFINA cung cấp băng ghế chờ chắc chắn, ghế phòng chờ chân xoay tiện lợi — chất liệu dễ vệ sinh, kiểu dáng hiện đại, chịu tần suất sử dụng cao.</p>' +
      '<p>Sản phẩm chính hãng, bảo hành 24 tháng, giao lắp tận nơi.</p>',
    faqs: [
      {
        q: 'Ghế phòng chờ nên chọn chất liệu nào dễ vệ sinh?',
        a: 'Nên chọn ghế mặt nệm PU/da công nghiệp hoặc nhựa/inox — lau chùi nhanh, bền với tần suất sử dụng cao tại khu vực công cộng.',
      },
      {
        q: 'Băng ghế chờ có mấy chỗ ngồi?',
        a: 'Phổ biến 2, 3 và 4 chỗ. OFINA tư vấn số chỗ và bố trí theo diện tích sảnh/phòng chờ của bạn.',
      },
    ],
    filter: { categorySlugs: ['ghe-phong-cho', 'ghe-phong-cho-chan-xoay'] },
    sort: 'newest',
  },
  {
    slug: 'ghe-bar-cafe',
    name: 'Ghế bar & bàn ghế cafe',
    metaDescription:
      'Ghế bar, bàn ghế cafe tại OFINA: ghế quầy bar chân sắt, ghế cafe chân cố định, bàn cafe. Bền đẹp, hiện đại cho quán, đảo bếp, văn phòng. Bảo hành 24 tháng.',
    intro:
      '<p><strong>Ghế bar và bàn ghế cafe</strong> phù hợp cho quán cafe, quầy bar, đảo bếp và khu pantry văn phòng. OFINA cung cấp ghế quầy bar chân sắt cao, ghế cafe chân cố định, bàn cafe nhiều kiểu dáng — chắc chắn, hiện đại và dễ phối không gian.</p>' +
      '<p>Sản phẩm chính hãng, bảo hành 24 tháng, giao lắp tận nơi tại Hà Nội & TP.HCM.</p>',
    faqs: [
      {
        q: 'Ghế bar cao bao nhiêu là phù hợp?',
        a: 'Ghế bar thường cao 60–75cm tuỳ chiều cao mặt quầy/đảo bếp. Nên chọn sao cho khoảng cách mặt ngồi đến mặt bàn khoảng 25–30cm.',
      },
      {
        q: 'Ghế bar có điều chỉnh độ cao được không?',
        a: 'Một số mẫu ghế bar tại OFINA có piston nâng hạ điều chỉnh độ cao. Thông tin ghi rõ trong từng sản phẩm.',
      },
    ],
    filter: { categorySlugs: ['ghe-bar', 'ghe-quay-bar-chan-sat', 'ghe-cafe-chan-co-dinh', 'ban-ghe-cafe-ghe-bar', 'ban-cafe'] },
    sort: 'newest',
  },
]

export function getCollection(slug: string): CollectionDef | undefined {
  return COLLECTIONS.find((c) => c.slug === slug)
}
