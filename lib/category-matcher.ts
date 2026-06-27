/**
 * Auto match category cho SP import dựa trên product name + URL slug + categoryHint.
 *
 * Logic:
 * 1. Normalize text (strip diacritics + lowercase)
 * 2. For each rule (specific → chung), check tất cả keywords có trong text không
 * 3. Match đầu tiên (most specific) thắng
 * 4. Fallback "ghe-cong-thai-hoc" nếu không match gì
 */

interface Rule {
  /** Keywords cần TẤT CẢ có trong text. Đã strip dấu. */
  kw: string[]
  slug: string
}

/** Categories OFINA đã verify từ DB (Jun 2026). Sắp xếp từ specific → chung. */
const RULES: Rule[] = [
  // === Ghế giám đốc / lãnh đạo (specific trước) ===
  { kw: ['ghe', 'massage', 'chinh dien'], slug: 'ghe-giam-doc-chinh-dien-massage' },
  { kw: ['ghe', 'giam doc', 'massage'], slug: 'ghe-giam-doc-chinh-dien-massage' },
  { kw: ['ghe', 'da', 'giam doc'], slug: 'ghe-da-giam-doc' },
  { kw: ['ghe', 'giam doc'], slug: 'ghe-da-giam-doc' },
  { kw: ['ghe', 'lanh dao'], slug: 'ghe-lanh-dao' },

  // === Ghế công thái học ===
  { kw: ['ghe', 'cong thai hoc'], slug: 'ghe-cong-thai-hoc' },
  { kw: ['ergonomic'], slug: 'ghe-cong-thai-hoc' },

  // === Ghế phòng họp ===
  { kw: ['ghe', 'phong hop'], slug: 'ghe-phong-hop-chan-dung' },
  { kw: ['ghe', 'hop'], slug: 'ghe-phong-hop-chan-dung' },
  { kw: ['ghe', 'trinh ky'], slug: 'ghe-trinh-ky' },
  { kw: ['ghe', 'chu toa'], slug: 'ghe-chu-toa' },

  // === Ghế chân quỳ ===
  { kw: ['ghe', 'chan quy', 'da'], slug: 'ghe-chan-quy-da' },
  { kw: ['ghe', 'chan quy', 'luoi'], slug: 'ghe-chan-quy-luoi' },
  { kw: ['ghe', 'chan quy', 'lung cao'], slug: 'ghe-chan-quy-lung-cao' },
  { kw: ['ghe', 'chan quy', 'lung trung'], slug: 'ghe-chan-quy-lung-trung' },
  { kw: ['ghe', 'chan quy'], slug: 'ghe-chan-quy' },

  // === Ghế xoay văn phòng ===
  { kw: ['ghe', 'xoay', 'luoi', 'tua dau'], slug: 'ghe-xoay-luoi-tua-dau' },
  { kw: ['ghe', 'xoay', 'lung cao'], slug: 'ghe-xoay-lung-cao' },
  { kw: ['ghe', 'xoay', 'lung trung'], slug: 'ghe-xoay-lung-trung' },
  { kw: ['ghe', 'xoay', 'luoi'], slug: 'ghe-xoay-luoi' },
  { kw: ['ghe', 'xoay', 'da'], slug: 'ghe-xoay-da' },
  { kw: ['ghe', 'xoay'], slug: 'ghe-xoay-van-phong' },

  // === Ghế khác ===
  { kw: ['ghe', 'truong phong'], slug: 'ghe-xoay-lung-cao' },
  { kw: ['ghe', 'hoi truong'], slug: 'ghe-hoi-truong' },
  { kw: ['ghe', 'thu gian'], slug: 'ghe-thu-gian' },
  { kw: ['ghe', 'phong cho', 'xoay'], slug: 'ghe-phong-cho-chan-xoay' },
  { kw: ['ghe', 'phong cho'], slug: 'ghe-phong-cho-chan-co-dinh' },
  { kw: ['ghe', 'rap phim'], slug: 'ghe-rap-phim' },
  { kw: ['ghe', 'training'], slug: 'ghe-training' },
  { kw: ['ghe', 'bang cho'], slug: 'ghe-bang-cho' },
  { kw: ['ghe', 'armchair'], slug: 'ghe-armchair' },
  { kw: ['ghe', 'van phong'], slug: 'ghe-van-phong' },

  // === Ghế cafe / bar ===
  { kw: ['ghe', 'bar'], slug: 'ghe-bar' },
  { kw: ['ghe', 'cafe', 'xoay'], slug: 'ghe-cafe-chan-xoay' },
  { kw: ['ghe', 'cafe'], slug: 'ghe-cafe-chan-co-dinh' },
  { kw: ['ghe', 'quay bar', 'go'], slug: 'ghe-quay-bar-chan-go' },
  { kw: ['ghe', 'quay bar', 'sat'], slug: 'ghe-quay-bar-chan-sat' },
  { kw: ['ghe', 'quay bar'], slug: 'ghe-quay-bar-chan-sat' },

  // === Bàn ===
  { kw: ['ban', 'giam doc', 'chan sat'], slug: 'ban-giam-doc-chan-sat' },
  { kw: ['ban', 'giam doc'], slug: 'ban-giam-doc' },
  { kw: ['ban', 'lanh dao'], slug: 'ban-lanh-dao' },
  { kw: ['ban', 'hop', 'go cong nghiep'], slug: 'ban-hop-go-cong-nghiep' },
  { kw: ['ban', 'hop', 'chan go'], slug: 'ban-hop-chan-go' },
  { kw: ['ban', 'hop', 'chan sat'], slug: 'ban-hop-van-phong-chan-sat' },
  { kw: ['ban', 'hop', 'cao cap'], slug: 'ban-hop-van-phong-cao-cap' },
  { kw: ['ban', 'hop', 'lon'], slug: 'ban-hop-lon' },
  { kw: ['ban', 'hop'], slug: 'ban-hop-van-phong' },
  { kw: ['ban', 'nang ha', '2 motor'], slug: 'ban-nang-ha-2-motor' },
  { kw: ['ban', 'nang ha', '1 motor'], slug: 'ban-nang-ha-1-motor' },
  { kw: ['ban', 'nang ha'], slug: 'ban-nang-ha-thong-minh' },
  { kw: ['ban', 'lam viec', 'chan go'], slug: 'ban-lam-viec-chan-go' },
  { kw: ['ban', 'lam viec', 'chan sat'], slug: 'ban-lam-viec-chan-sat' },
  { kw: ['ban', 'lam viec'], slug: 'ban-lam-viec-chan-sat' },
  { kw: ['ban', 'training'], slug: 'ban-training' },
  { kw: ['ban', 'tra'], slug: 'ban-tra' },
  { kw: ['ban', 'cafe', 'chan sat'], slug: 'ban-cafe-chan-sat-mat-go-kinh-abs' },
  { kw: ['ban', 'cafe', 'gap gon'], slug: 'ban-cafe-gap-gon' },
  { kw: ['ban', 'cafe'], slug: 'ban-cafe' },
  { kw: ['ban', 'hoc sinh'], slug: 'ban-ghe-hoc-sinh' },

  // === Cụm bàn ===
  { kw: ['cum ban', '8 nguoi'], slug: 'cum-ban-lam-viec-8-nguoi' },
  { kw: ['cum ban', '6 nguoi'], slug: 'cum-ban-lam-viec-6-nguoi' },
  { kw: ['cum ban', '4 nguoi'], slug: 'cum-ban-lam-viec-4-nguoi' },
  { kw: ['cum ban', '3 nguoi'], slug: 'cum-ban-lam-viec-3-nguoi' },
  { kw: ['cum ban', '2 nguoi'], slug: 'cum-ban-lam-viec-2-nguoi' },
  { kw: ['cum ban'], slug: 'cum-ban-lam-viec' },

  // === Tủ / kệ ===
  { kw: ['tu', 'giam doc'], slug: 'tu-giam-doc' },
  { kw: ['tu', 'ho so', 'cao'], slug: 'tu-ho-so-cao' },
  { kw: ['tu', 'ho so'], slug: 'tu-ho-so-thap-tu-cay' },
  { kw: ['tu', 'tai lieu'], slug: 'tu-tai-lieu-sat' },
  { kw: ['tu', 'quan ao'], slug: 'tu-sat-dung-quan-ao' },
  { kw: ['tu', 'locker'], slug: 'tu-locker-go' },
  { kw: ['tu', 'mam non'], slug: 'tu-mam-non' },
  { kw: ['tu', 'de giay'], slug: 'tu-de-giay' },
  { kw: ['tu', 'sat'], slug: 'tu-sat' },
  { kw: ['hoc di dong'], slug: 'hoc-di-dong-tu-phu' },
  { kw: ['gia ke', 'sat'], slug: 'gia-ke-sat' },
  { kw: ['gia ke'], slug: 'gia-ke-sat' },
  { kw: ['ke sach'], slug: 'ke-sach-thu-vien' },
  { kw: ['ke trang tri'], slug: 'ke-trang-tri' },

  // === Sofa ===
  { kw: ['sofa', 'goc'], slug: 'sofa-goc' },
  { kw: ['sofa', 'don'], slug: 'sofa-don' },
  { kw: ['sofa', 'doi'], slug: 'sofa-doi' },
  { kw: ['sofa', 'vang'], slug: 'sofa-vang' },
  { kw: ['sofa', 'gia dinh'], slug: 'sofa-gia-dinh' },
  { kw: ['sofa', 'van phong'], slug: 'sofa-van-phong' },
  { kw: ['sofa'], slug: 'sofa-van-phong' },
  { kw: ['don sofa'], slug: 'don-sofa' },

  // === Khác ===
  { kw: ['quay le tan'], slug: 'quay-le-tan' },
  { kw: ['bang', 'van phong'], slug: 'bang-van-phong' },
  { kw: ['vach ngan'], slug: 'vach-ni-govi' },
  { kw: ['cabin', 'cach am'], slug: 'cabin-cach-am-di-dong' },
  { kw: ['giuong', 'tang'], slug: 'giuong-tang-sat' },

  // === Final fallback ===
  { kw: ['ghe'], slug: 'ghe-van-phong' },
  { kw: ['ban'], slug: 'ban-lam-viec-chan-sat' },
  { kw: ['tu'], slug: 'tu-tai-lieu-sat' },
]

/** Strip diacritics tiếng Việt + lowercase + remove special chars */
function normalize(s: string): string {
  return s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Match category slug từ product info.
 * @param productName Tên SP
 * @param urlSlug Slug từ URL (vd "ghe-giam-doc-massage-lux-01-n")
 * @param categoryHint Hint từ nguồn (vd "Ghế giám đốc Massage")
 * @returns category slug match best, hoặc null nếu không match
 */
export function matchCategory(
  productName: string,
  urlSlug?: string,
  categoryHint?: string,
): { slug: string; matchedKeywords: string[] } | null {
  const text = normalize(
    [productName, urlSlug?.replace(/-/g, ' ') || '', categoryHint || ''].join(' '),
  )

  for (const rule of RULES) {
    if (rule.kw.length === 0) continue
    const allMatch = rule.kw.every((kw) => text.includes(kw))
    if (allMatch) {
      return { slug: rule.slug, matchedKeywords: rule.kw }
    }
  }
  return null
}
