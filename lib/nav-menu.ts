/**
 * Mega menu đầy đủ cho OFINA — bao phủ toàn bộ 95 danh mục
 * Tổ chức thành 6 nhóm chính
 */

export type MenuCategory = {
  slug: string
  name: string
}

export type MenuGroup = {
  title: string
  columns: {
    heading: string
    items: MenuCategory[]
  }[]
}

export type MenuItem = {
  label: string
  href: string
  mega?: MenuGroup
}

export const NAV_MENU: MenuItem[] = [
  // ============ GHẾ VĂN PHÒNG ============
  {
    label: 'Ghế',
    href: '/danh-muc/ghe-van-phong',
    mega: {
      title: 'Ghế văn phòng',
      columns: [
        {
          heading: 'Ghế xoay',
          items: [
            { slug: 'ghe-xoay-van-phong', name: 'Ghế xoay văn phòng' },
            { slug: 'ghe-xoay-lung-cao', name: 'Ghế xoay lưng cao' },
            { slug: 'ghe-xoay-lung-trung', name: 'Ghế xoay lưng trung' },
            { slug: 'ghe-xoay-luoi', name: 'Ghế xoay lưới' },
            { slug: 'ghe-xoay-luoi-tua-dau', name: 'Ghế xoay lưới tựa đầu' },
            { slug: 'ghe-xoay-da', name: 'Ghế xoay da' },
          ],
        },
        {
          heading: 'Ghế lãnh đạo & Giám đốc',
          items: [
            { slug: 'ghe-da-giam-doc', name: 'Ghế da giám đốc' },
            { slug: 'ghe-lanh-dao', name: 'Ghế lãnh đạo' },
            { slug: 'ghe-chu-toa', name: 'Ghế chủ toạ' },
            { slug: 'ghe-giam-doc-chinh-dien-massage', name: 'Ghế giám đốc massage' },
            { slug: 'ghe-trinh-ky', name: 'Ghế trình ký' },
            { slug: 'ghe-cong-thai-hoc', name: 'Ghế công thái học' },
          ],
        },
        {
          heading: 'Ghế chân quỳ',
          items: [
            { slug: 'ghe-chan-quy', name: 'Ghế chân quỳ' },
            { slug: 'ghe-chan-quy-lung-cao', name: 'Ghế chân quỳ lưng cao' },
            { slug: 'ghe-chan-quy-lung-trung', name: 'Ghế chân quỳ lưng trung' },
            { slug: 'ghe-chan-quy-luoi', name: 'Ghế chân quỳ lưới' },
            { slug: 'ghe-chan-quy-da', name: 'Ghế chân quỳ da' },
          ],
        },
        {
          heading: 'Ghế khác',
          items: [
            { slug: 'ghe-van-phong', name: 'Ghế văn phòng' },
            { slug: 'ghe-training', name: 'Ghế training' },
            { slug: 'ghe-phong-hop-chan-dung', name: 'Ghế phòng họp' },
          ],
        },
      ],
    },
  },

  // ============ BÀN LÀM VIỆC ============
  {
    label: 'Bàn',
    href: '/danh-muc/ban-lam-viec',
    mega: {
      title: 'Bàn làm việc & Bàn họp',
      columns: [
        {
          heading: 'Bàn làm việc',
          items: [
            { slug: 'ban-lam-viec-chan-sat', name: 'Bàn làm việc chân sắt' },
            { slug: 'ban-lam-viec-chan-go', name: 'Bàn làm việc chân gỗ' },
            { slug: 'ban-giam-doc', name: 'Bàn giám đốc' },
            { slug: 'ban-giam-doc-chan-sat', name: 'Bàn giám đốc chân sắt' },
            { slug: 'ban-lanh-dao', name: 'Bàn lãnh đạo' },
          ],
        },
        {
          heading: 'Cụm bàn làm việc',
          items: [
            { slug: 'cum-ban-lam-viec', name: 'Cụm bàn làm việc' },
            { slug: 'cum-ban-lam-viec-2-nguoi', name: '2 người' },
            { slug: 'cum-ban-lam-viec-3-nguoi', name: '3 người' },
            { slug: 'cum-ban-lam-viec-4-nguoi', name: '4 người' },
            { slug: 'cum-ban-lam-viec-6-nguoi', name: '6 người' },
            { slug: 'cum-ban-lam-viec-8-nguoi', name: '8 người' },
          ],
        },
        {
          heading: 'Bàn họp',
          items: [
            { slug: 'ban-hop-van-phong', name: 'Bàn họp văn phòng' },
            { slug: 'ban-hop-van-phong-chan-sat', name: 'Bàn họp chân sắt' },
            { slug: 'ban-hop-chan-go', name: 'Bàn họp chân gỗ' },
            { slug: 'ban-hop-lon', name: 'Bàn họp lớn' },
            { slug: 'ban-hop-van-phong-cao-cap', name: 'Bàn họp cao cấp' },
            { slug: 'ban-training', name: 'Bàn training' },
          ],
        },
        {
          heading: 'Bàn đặc biệt',
          items: [
            { slug: 'ban-nang-ha-thong-minh', name: 'Bàn nâng hạ thông minh' },
            { slug: 'ban-nang-ha-1-motor', name: 'Bàn nâng hạ 1 Motor' },
            { slug: 'ban-nang-ha-2-motor', name: 'Bàn nâng hạ 2 Motor' },
            { slug: 'ban-tra', name: 'Bàn trà' },
            { slug: 'ban-cafe', name: 'Bàn cafe' },
          ],
        },
      ],
    },
  },

  // ============ TỦ & KỆ ============
  {
    label: 'Tủ & Kệ',
    href: '/danh-muc/tu-van-phong',
    mega: {
      title: 'Tủ hồ sơ & Kệ văn phòng',
      columns: [
        {
          heading: 'Tủ hồ sơ',
          items: [
            { slug: 'tu-ho-so-cao', name: 'Tủ hồ sơ cao' },
            { slug: 'tu-ho-so-thap-tu-cay', name: 'Tủ hồ sơ thấp / tủ cây' },
            { slug: 'tu-tai-lieu-sat', name: 'Tủ tài liệu sắt' },
            { slug: 'tu-sat', name: 'Tủ sắt' },
            { slug: 'hoc-di-dong-tu-phu', name: 'Hộc di động / Tủ phụ' },
          ],
        },
        {
          heading: 'Tủ locker & Tủ giám đốc',
          items: [
            { slug: 'tu-locker-go', name: 'Tủ locker gỗ' },
            { slug: 'tu-giam-doc', name: 'Tủ giám đốc' },
            { slug: 'tu-sat-dung-quan-ao', name: 'Tủ sắt đựng quần áo' },
            { slug: 'tu-de-giay', name: 'Tủ để giày' },
            { slug: 'tu-mam-non', name: 'Tủ mầm non' },
          ],
        },
        {
          heading: 'Kệ trang trí & Giá kệ',
          items: [
            { slug: 'ke-trang-tri', name: 'Kệ trang trí' },
            { slug: 'ke-sach-thu-vien', name: 'Kệ sách thư viện' },
            { slug: 'gia-ke-sat', name: 'Giá kệ sắt' },
            { slug: 'gia-ke-v-lo-govi', name: 'Giá kệ V lỗ' },
            { slug: 'ke-trung-tai', name: 'Kệ trung tải' },
          ],
        },
        {
          heading: 'Khác',
          items: [
            { slug: 'quay-le-tan', name: 'Quầy lễ tân' },
            { slug: 'bang-van-phong', name: 'Bảng văn phòng' },
            { slug: 'giuong-tang-sat', name: 'Giường tầng sắt' },
            { slug: 'cabin-cach-am-di-dong', name: 'Cabin cách âm' },
            { slug: 'vach-ni-govi', name: 'Vách ngăn nỉ' },
          ],
        },
      ],
    },
  },

  // ============ SOFA / GHẾ THƯ GIÃN ============
  {
    label: 'Sofa',
    href: '/danh-muc/sofa-van-phong',
    mega: {
      title: 'Sofa & Ghế thư giãn',
      columns: [
        {
          heading: 'Sofa văn phòng',
          items: [
            { slug: 'sofa-van-phong', name: 'Sofa văn phòng' },
            { slug: 'sofa-don', name: 'Sofa đơn' },
            { slug: 'sofa-doi', name: 'Sofa đôi' },
            { slug: 'sofa-goc', name: 'Sofa góc' },
            { slug: 'sofa-vang', name: 'Sofa văng' },
            { slug: 'sofa-gia-dinh', name: 'Sofa gia đình' },
          ],
        },
        {
          heading: 'Ghế thư giãn',
          items: [
            { slug: 'ghe-thu-gian', name: 'Ghế thư giãn' },
            { slug: 'ghe-armchair', name: 'Ghế armchair' },
            { slug: 'ghe-cho-sofa', name: 'Ghế chờ sofa' },
            { slug: 'bo-ghe-sofa', name: 'Bộ ghế sofa' },
            { slug: 'don-sofa', name: 'Đôn sofa' },
            { slug: 'ghe-bap-benh', name: 'Ghế bập bênh' },
          ],
        },
      ],
    },
  },

  // ============ CAFE / BAR / HỘI TRƯỜNG ============
  {
    label: 'Cafe & Bar',
    href: '/danh-muc/ghe-cafe',
    mega: {
      title: 'Ghế Cafe, Bar & Hội trường',
      columns: [
        {
          heading: 'Ghế cafe',
          items: [
            { slug: 'ghe-cafe', name: 'Ghế cafe' },
            { slug: 'ghe-cafe-chan-co-dinh', name: 'Ghế cafe chân cố định' },
            { slug: 'ghe-cafe-chan-xoay', name: 'Ghế cafe chân xoay' },
            { slug: 'bo-ban-ghe-cafe', name: 'Bộ bàn ghế cafe' },
            { slug: 'ban-ghe-cafe-ghe-bar', name: 'Bàn ghế cafe - bar' },
          ],
        },
        {
          heading: 'Bàn cafe & Ghế quầy bar',
          items: [
            { slug: 'ban-cafe', name: 'Bàn cafe' },
            { slug: 'ban-cafe-chan-sat-mat-go-kinh-abs', name: 'Bàn cafe chân sắt mặt đá' },
            { slug: 'ban-cafe-gap-gon', name: 'Bàn cafe gấp gọn' },
            { slug: 'ghe-bar', name: 'Ghế bar' },
            { slug: 'ghe-quay-bar-chan-sat', name: 'Ghế quầy bar chân sắt' },
            { slug: 'ghe-quay-bar-chan-go', name: 'Ghế quầy bar chân gỗ' },
          ],
        },
        {
          heading: 'Hội trường & Phòng chờ',
          items: [
            { slug: 'ghe-hoi-truong', name: 'Ghế hội trường' },
            { slug: 'ghe-rap-phim', name: 'Ghế rạp phim' },
            { slug: 'ghe-bang-cho', name: 'Ghế băng chờ' },
            { slug: 'ghe-phong-cho', name: 'Ghế phòng chờ' },
            { slug: 'ghe-phong-cho-chan-co-dinh', name: 'Ghế phòng chờ chân cố định' },
            { slug: 'ghe-phong-cho-chan-xoay', name: 'Ghế phòng chờ chân xoay' },
          ],
        },
        {
          heading: 'Đặc biệt',
          items: [
            { slug: 'ban-ghe-hoc-sinh', name: 'Bàn ghế học sinh' },
            { slug: 'ban-hop-go-cong-nghiep', name: 'Bàn họp gỗ công nghiệp' },
          ],
        },
      ],
    },
  },

  // ============ Links đơn ============
  { label: 'Nâng hạ', href: '/danh-muc/ban-nang-ha-thong-minh' },
  { label: 'MỚI 2026', href: '/san-pham-moi-2026' },
  { label: 'Blog', href: '/blog' },
]
