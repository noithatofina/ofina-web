/**
 * Nội dung SEO cho trang danh mục (/danh-muc/[slug]).
 *
 * Vì sao có file này: GSC 28/09/2026 cho thấy 1.141 trang bị Google "đã thu
 * thập – chưa lập chỉ mục", và toàn bộ truy vấn ra nhấp đều là brand/mã sản
 * phẩm. Nguyên nhân: trang danh mục chỉ có lưới sản phẩm, 0 thẻ H2, không FAQ.
 * File này bổ sung phần nội dung để trang đủ dày mà Google chịu index, theo
 * đúng khuôn đã hiệu quả ở /bo-suu-tap.
 *
 * NGUYÊN TẮC VIẾT:
 * - Chỉ nêu điều đúng với dữ liệu thật (số lượng, khoảng giá lấy từ DB) và
 *   chính sách thật. KHÔNG bịa giải thưởng, chứng nhận, số liệu nghiên cứu.
 * - Bảo hành phải khớp policy.bao-hanh: khung kim loại/gỗ và motor bàn nâng hạ
 *   24 tháng; đệm, da, nỉ, cơ chế xoay, piston 12 tháng.
 * - Danh mục nào chưa có ở đây thì trang vẫn chạy bình thường, chỉ thiếu phần
 *   nội dung — thêm dần theo mức độ ưu tiên.
 */

export interface CategoryFaq {
  q: string
  a: string
}

export interface CategorySection {
  h2: string
  /** HTML đơn giản: <p>, <ul>, <li>, <strong>, <table> */
  body: string
}

export interface CategoryContent {
  /** Đoạn mở đầu ngay dưới H1 */
  intro: string
  sections: CategorySection[]
  faqs: CategoryFaq[]
}

const WARRANTY_NOTE =
  'Bảo hành theo chính sách OFINA: khung kim loại và khung gỗ 24 tháng; đệm, da, nỉ, cơ chế xoay và piston 12 tháng.'

export const CATEGORY_CONTENT: Record<string, CategoryContent> = {
  'ghe-da-giam-doc': {
    intro:
      '<p><strong>Ghế da giám đốc</strong> là chiếc ghế người lãnh đạo ngồi nhiều giờ mỗi ngày, đồng thời là chi tiết khách nhìn thấy đầu tiên khi bước vào phòng. Vì vậy ghế phải đạt cả hai: nâng đỡ đúng tư thế trong thời gian dài và giữ được dáng vẻ chỉn chu sau vài năm sử dụng.</p>' +
      '<p>Danh mục này tại OFINA trải rộng từ mẫu phổ thông cho phòng làm việc riêng đến mẫu lưng cao bọc da dành cho phòng chủ tịch, đủ để chọn theo diện tích phòng và ngân sách thực tế của doanh nghiệp.</p>',
    sections: [
      {
        h2: 'Chọn ghế da giám đốc theo tiêu chí nào?',
        body:
          '<ul>' +
          '<li><strong>Chất liệu bọc:</strong> da thật bền và đẹp theo thời gian nhưng cần dưỡng định kỳ; da công nghiệp (PU, microfiber) dễ vệ sinh, giá mềm hơn, phù hợp phòng dùng điều hoà thường xuyên.</li>' +
          '<li><strong>Chiều cao lưng:</strong> lưng cao có tựa đầu hợp với người ngồi lâu và hay ngả lưng nghỉ; lưng trung bình gọn hơn, hợp phòng diện tích vừa.</li>' +
          '<li><strong>Cơ chế ngả:</strong> ghế chỉ bập bênh khác hẳn ghế ngả nhiều nấc có khoá — nếu bạn hay ngả ra suy nghĩ hoặc nghỉ trưa tại chỗ, hãy chọn loại khoá được góc ngả.</li>' +
          '<li><strong>Chân ghế:</strong> chân hợp kim nhôm chịu tải và bền hơn chân nhựa, đáng cân nhắc với người có thể trạng lớn.</li>' +
          '<li><strong>Kích thước so với bàn:</strong> đo khoảng hở giữa mặt bàn và tay ghế trước khi mua, tránh trường hợp ghế không đẩy sát vào bàn được.</li>' +
          '</ul>',
      },
      {
        h2: 'Ghế da giám đốc dùng bền hơn nếu làm đúng vài việc nhỏ',
        body:
          '<p>Da sợ nhất nắng chiếu trực tiếp và nhiệt độ cao — đặt ghế lệch khỏi vệt nắng cửa sổ sẽ hạn chế bạc màu và nứt bề mặt. Lau bụi bằng khăn mềm khô, tránh dung dịch tẩy mạnh và cồn.</p>' +
          '<p>Piston và cơ chế xoay là bộ phận chịu lực nhiều nhất; nếu thấy ghế tụt dần khi ngồi hoặc phát ra tiếng lạ khi xoay, nên báo bảo hành sớm thay vì chờ hỏng hẳn. ' +
          WARRANTY_NOTE +
          '</p>',
      },
    ],
    faqs: [
      {
        q: 'Ghế da giám đốc nên chọn da thật hay da công nghiệp?',
        a: 'Da thật thoáng hơn khi ngồi lâu và lên màu đẹp theo thời gian, nhưng giá cao và cần dưỡng định kỳ. Da công nghiệp cao cấp dễ vệ sinh, ít kén môi trường, chi phí thấp hơn đáng kể. Nếu ghế đặt ở phòng tiếp khách quan trọng và ngân sách cho phép, da thật đáng đầu tư; nếu ưu tiên bền bỉ và dễ chăm sóc, da công nghiệp là lựa chọn hợp lý.',
      },
      {
        q: 'Người cao trên 1m75 nên chọn ghế giám đốc thế nào?',
        a: 'Ưu tiên ghế lưng cao có tựa đầu điều chỉnh được, chiều sâu đệm ngồi rộng và chân hợp kim nhôm chịu tải tốt. Khi ngồi, lưng ghế nên đỡ tới giữa vai và hai bàn chân vẫn chạm sàn thoải mái.',
      },
      {
        q: 'Ghế giám đốc có lắp đặt tại nhà không?',
        a: 'OFINA giao và lắp đặt tận nơi tại Hà Nội và TP.HCM. Với các tỉnh khác, hàng được đóng gói kèm hướng dẫn lắp và bộ dụng cụ; đội ngũ kỹ thuật hỗ trợ qua hotline trong quá trình lắp.',
      },
      {
        q: 'Bảo hành ghế da giám đốc bao lâu?',
        a: 'Khung kim loại và khung gỗ được bảo hành 24 tháng. Phần đệm, da, nỉ cùng cơ chế xoay và piston bảo hành 12 tháng. Bảo hành không áp dụng cho hư hỏng do va đập, đổ nước hoặc sửa chữa ở nơi không được OFINA uỷ quyền.',
      },
    ],
  },

  'ghe-phong-hop-chan-dung': {
    intro:
      '<p><strong>Ghế phòng họp chân đứng</strong> (chân quỳ, chân chữ C, chân tĩnh) là lựa chọn quen thuộc cho phòng họp vì không xoay, không trôi, giúp hàng ghế luôn thẳng và phòng họp gọn gàng ngay cả sau buổi họp đông người.</p>' +
      '<p>Vì mỗi người chỉ ngồi 30–90 phút mỗi lượt, tiêu chí chọn ghế họp khác hẳn ghế làm việc: ưu tiên độ chắc chắn, dễ xếp và đồng bộ thẩm mỹ với bàn họp hơn là nhiều chức năng điều chỉnh.</p>',
    sections: [
      {
        h2: 'Cần bao nhiêu ghế cho phòng họp?',
        body:
          '<p>Cách tính nhanh theo số chỗ quanh bàn họp: mỗi người cần khoảng 60–70cm chiều dài mép bàn để ngồi thoải mái. Bàn họp 2m4 thường kê 8 ghế (3 mỗi cạnh dài, 1 mỗi đầu), bàn 3m2 kê 10–12 ghế.</p>' +
          '<p>Nên dự phòng thêm 2–4 ghế cùng mẫu để dùng khi họp đông hoặc thay thế về sau — mẫu ghế có thể ngừng sản xuất, mua bù sau sẽ khó khớp màu và kiểu dáng.</p>',
      },
      {
        h2: 'Chân quỳ, chân chữ C hay chân tĩnh?',
        body:
          '<ul>' +
          '<li><strong>Chân quỳ (chân trượt):</strong> có độ đàn hồi nhẹ khi ngả người, ngồi lâu đỡ mỏi hơn, di chuyển êm trên sàn gạch.</li>' +
          '<li><strong>Chân chữ C:</strong> dáng hiện đại, thường đi với đệm lưới hoặc da, hợp phòng họp phong cách tối giản.</li>' +
          '<li><strong>Chân tĩnh bốn chân:</strong> chắc chắn nhất, nhiều mẫu xếp chồng được để cất gọn khi không dùng — phù hợp phòng đa năng vừa họp vừa đào tạo.</li>' +
          '</ul>',
      },
    ],
    faqs: [
      {
        q: 'Ghế phòng họp nên bọc lưới hay bọc nệm?',
        a: 'Lưới thoáng hơn, hợp phòng họp không có điều hoà hoặc họp kéo dài. Nệm bọc vải hoặc da tạo cảm giác chỉn chu hơn cho phòng tiếp khách và phòng họp lãnh đạo. Nếu phòng dùng chung cho nhiều mục đích, lưới là lựa chọn an toàn vì dễ vệ sinh.',
      },
      {
        q: 'Ghế phòng họp có xếp chồng được không?',
        a: 'Một số mẫu chân tĩnh thiết kế xếp chồng để cất gọn; mẫu chân quỳ và chân chữ C thường không xếp chồng. Nếu phòng cần dọn trống thường xuyên, hãy nói rõ nhu cầu này khi liên hệ để được tư vấn đúng mẫu.',
      },
      {
        q: 'Mua số lượng lớn cho cả phòng họp có chính sách riêng không?',
        a: 'Có. OFINA nhận báo giá theo số lượng cho doanh nghiệp, kèm khảo sát mặt bằng và tư vấn bố trí. Bạn có thể gửi yêu cầu qua trang báo giá B2B hoặc gọi hotline để được tính phương án trọn bộ bàn và ghế.',
      },
      {
        q: 'Ghế phòng họp bảo hành thế nào?',
        a: 'Khung kim loại và khung gỗ 24 tháng; phần đệm, da, nỉ 12 tháng. Kỹ thuật viên kiểm tra tại chỗ trong nội thành và thay thế linh kiện lỗi miễn phí trong thời hạn bảo hành.',
      },
    ],
  },

  'ban-lam-viec-chan-sat': {
    intro:
      '<p><strong>Bàn làm việc chân sắt</strong> là cấu hình phổ biến nhất cho văn phòng hiện nay: khung sắt sơn tĩnh điện chịu lực tốt, mặt bàn gỗ công nghiệp phủ melamine hoặc laminate chống xước, giá hợp lý và dễ nhân bản cho cả dãy bàn nhân viên.</p>' +
      '<p>Danh mục này phủ nhiều kích thước từ bàn cá nhân nhỏ cho góc làm việc tại nhà đến bàn 1m4–1m6 cho văn phòng công ty.</p>',
    sections: [
      {
        h2: 'Chọn kích thước bàn làm việc theo không gian',
        body:
          '<ul>' +
          '<li><strong>1m–1m2:</strong> đủ cho một laptop và vài vật dụng, hợp góc làm việc tại nhà hoặc phòng nhỏ.</li>' +
          '<li><strong>1m2–1m4:</strong> kích thước cân bằng nhất cho nhân viên văn phòng dùng một màn hình rời.</li>' +
          '<li><strong>1m6 trở lên:</strong> đủ cho hai màn hình hoặc công việc cần trải tài liệu, bản vẽ.</li>' +
          '</ul>' +
          '<p>Chiều cao mặt bàn tiêu chuẩn khoảng 73–75cm. Khi kê, chừa tối thiểu 70–80cm phía sau ghế để kéo ghế ra vào không vướng.</p>',
      },
      {
        h2: 'Mặt bàn và khung: điều nên kiểm tra trước khi mua',
        body:
          '<p>Mặt gỗ công nghiệp dày 18–25mm cho độ cứng tốt hơn loại mỏng; cạnh bàn dán nẹp kín giúp chống ẩm ở mép — điểm thường hỏng trước nhất khi lau bàn bằng khăn ướt.</p>' +
          '<p>Khung sắt nên có thanh giằng ngang để bàn không rung khi gõ phím mạnh, và chân có nút điều chỉnh cân bằng nếu sàn nhà không phẳng tuyệt đối. ' +
          WARRANTY_NOTE +
          '</p>',
      },
    ],
    faqs: [
      {
        q: 'Bàn làm việc chân sắt có chắc bằng bàn chân gỗ không?',
        a: 'Khung sắt sơn tĩnh điện chịu lực tốt và ít cong vênh theo độ ẩm hơn chân gỗ, đồng thời nhẹ hơn khi cần di chuyển bố trí lại. Bàn chân gỗ thường được chọn vì thẩm mỹ ấm và đồng bộ nội thất, không hẳn vì độ bền.',
      },
      {
        q: 'Bàn có sẵn lỗ luồn dây điện không?',
        a: 'Tuỳ mẫu. Một số bàn có hộp luồn dây hoặc lỗ khoét sẵn trên mặt, một số không. Nếu bạn cần đi dây gọn cho màn hình và sạc, hãy hỏi rõ khi đặt hàng để chọn đúng mẫu hoặc bổ sung phụ kiện.',
      },
      {
        q: 'Mua nhiều bàn cho cả phòng thì bố trí thế nào hợp lý?',
        a: 'Với dãy nhân viên, cụm bàn đối diện hoặc bàn liền dãy tiết kiệm diện tích hơn kê bàn rời. OFINA có sẵn các cụm bàn 2, 3, 4 và 6 người; nếu gửi kích thước phòng, đội tư vấn sẽ đề xuất phương án kê và số lượng phù hợp.',
      },
      {
        q: 'Bàn giao tới có cần tự lắp không?',
        a: 'Tại Hà Nội và TP.HCM, OFINA giao và lắp đặt tận nơi. Các tỉnh khác nhận hàng đóng kiện kèm hướng dẫn và dụng cụ lắp, có hỗ trợ qua hotline nếu cần.',
      },
    ],
  },

  'ban-hop-van-phong-chan-sat': {
    intro:
      '<p><strong>Bàn họp văn phòng chân sắt</strong> phù hợp với phần lớn phòng họp doanh nghiệp: khung sắt chịu được mặt bàn dài mà không võng, kiểu dáng trung tính dễ phối với nhiều phong cách nội thất, chi phí thấp hơn bàn khung gỗ nguyên khối cùng kích thước.</p>' +
      '<p>Chọn bàn họp bắt đầu từ một câu hỏi duy nhất: phòng thường họp bao nhiêu người, và phòng rộng bao nhiêu.</p>',
    sections: [
      {
        h2: 'Kích thước bàn họp theo số người ngồi',
        body:
          '<table>' +
          '<tr><th>Số người</th><th>Chiều dài bàn tham khảo</th><th>Phòng tối thiểu</th></tr>' +
          '<tr><td>6 người</td><td>1m8 – 2m0</td><td>khoảng 12 m²</td></tr>' +
          '<tr><td>8 người</td><td>2m4</td><td>khoảng 16 m²</td></tr>' +
          '<tr><td>10 – 12 người</td><td>3m2 – 3m6</td><td>khoảng 22 m²</td></tr>' +
          '<tr><td>16 người trở lên</td><td>4m8 trở lên hoặc ghép module</td><td>từ 30 m²</td></tr>' +
          '</table>' +
          '<p>Nguyên tắc chung: mỗi người cần 60–70cm mép bàn, và chừa tối thiểu 1m quanh bàn để kéo ghế và đi lại.</p>',
      },
      {
        h2: 'Những chi tiết hay bị bỏ sót khi mua bàn họp',
        body:
          '<ul>' +
          '<li><strong>Đường điện và mạng:</strong> phòng họp hay cần ổ cắm cho laptop và màn hình trình chiếu — cân nhắc mẫu có hộp điện âm bàn hoặc lỗ luồn dây.</li>' +
          '<li><strong>Vị trí chân bàn:</strong> chân đặt quá sát mép sẽ chắn chỗ ngồi ở hai đầu bàn.</li>' +
          '<li><strong>Lối vào phòng:</strong> mặt bàn dài trên 3m cần kiểm tra cửa và hành lang trước khi đặt, hoặc chọn loại lắp ghép tại chỗ.</li>' +
          '</ul>',
      },
    ],
    faqs: [
      {
        q: 'Phòng họp 20m² nên chọn bàn họp dài bao nhiêu?',
        a: 'Phòng khoảng 20m² thường phù hợp bàn 2m4 đến 3m2, tương ứng 8–10 chỗ ngồi, vẫn còn lối đi quanh bàn. Nếu phòng có màn hình trình chiếu ở một đầu, nên trừ thêm khoảng trống cho người đứng thuyết trình.',
      },
      {
        q: 'Bàn họp chân sắt có bị rung khi viết không?',
        a: 'Mẫu có thanh giằng ngang và chân đế rộng sẽ rất ít rung. Với bàn dài trên 3m, nên chọn loại có chân giữa hoặc khung kép để mặt bàn không võng theo thời gian.',
      },
      {
        q: 'Có thể đặt bàn họp theo kích thước riêng không?',
        a: 'OFINA nhận tư vấn phương án cho phòng có kích thước đặc thù. Bạn gửi sơ đồ phòng hoặc số đo qua trang báo giá B2B, đội ngũ sẽ đề xuất cấu hình bàn và số ghế phù hợp.',
      },
      {
        q: 'Bàn họp bảo hành bao lâu?',
        a: 'Khung kim loại và khung gỗ 24 tháng theo chính sách bảo hành của OFINA. Hư hỏng do va đập hoặc đổ nước không thuộc phạm vi bảo hành.',
      },
    ],
  },

  'ban-lanh-dao': {
    intro:
      '<p><strong>Bàn lãnh đạo</strong> khác bàn nhân viên ở ba điểm: mặt bàn rộng hơn để vừa làm việc vừa trao đổi, thường có tủ phụ hoặc hộc kéo đi kèm, và hoàn thiện bề mặt chỉn chu hơn vì phòng lãnh đạo cũng là nơi tiếp khách.</p>' +
      '<p>Danh mục trải từ mẫu gọn cho phòng trưởng phòng đến bàn lớn có tủ phụ cho phòng giám đốc, chủ tịch.</p>',
    sections: [
      {
        h2: 'Chọn bàn lãnh đạo theo diện tích phòng',
        body:
          '<ul>' +
          '<li><strong>Phòng 12–15 m²:</strong> bàn 1m6–1m8 kèm tủ thấp là vừa, tránh bàn quá lớn làm phòng chật.</li>' +
          '<li><strong>Phòng 18–25 m²:</strong> bàn 2m–2m2 có tủ phụ chữ L, còn chỗ kê thêm bộ sofa tiếp khách nhỏ.</li>' +
          '<li><strong>Phòng trên 25 m²:</strong> bàn 2m4 trở lên, có thể kết hợp bàn họp nhỏ 4–6 chỗ ngay trong phòng.</li>' +
          '</ul>' +
          '<p>Nguyên tắc kê: giữ lối đi sau ghế tối thiểu 90cm, và không kê bàn chắn ngang cửa ra vào.</p>',
      },
      {
        h2: 'Bàn lãnh đạo nên đi cùng ghế nào?',
        body:
          '<p>Chiều cao mặt bàn 73–75cm hợp với hầu hết ghế giám đốc có piston điều chỉnh. Điều cần kiểm tra là <strong>chiều cao tay ghế</strong>: tay ghế cao quá sẽ vướng mép bàn, khiến ghế không đẩy sát vào được.</p>' +
          '<p>Nếu phòng có tiếp khách, nên chuẩn bị thêm 2 ghế đối diện cùng tông màu với ghế chính để bộ bàn ghế nhìn đồng bộ.</p>',
      },
    ],
    faqs: [
      {
        q: 'Bàn lãnh đạo có kèm tủ phụ không?',
        a: 'Tuỳ mẫu. Nhiều mẫu bàn lãnh đạo thiết kế kèm tủ phụ chữ L hoặc hộc kéo di động; một số mẫu bán riêng phần bàn. Thông tin cấu hình cụ thể ghi trong trang từng sản phẩm, hoặc gọi hotline để được xác nhận trước khi đặt.',
      },
      {
        q: 'Nên chọn bàn mặt gỗ tự nhiên hay gỗ công nghiệp?',
        a: 'Gỗ công nghiệp phủ melamine hoặc laminate chống xước tốt, ổn định với độ ẩm và giá hợp lý — phù hợp đa số văn phòng. Veneer và gỗ tự nhiên cho vân đẹp và cảm giác sang trọng hơn, nhưng cần tránh nắng chiếu trực tiếp và lau chùi đúng cách.',
      },
      {
        q: 'Bàn lớn có vận chuyển lên tầng cao được không?',
        a: 'Với bàn dài, OFINA kiểm tra kích thước thang máy và hành lang trước khi giao; nhiều mẫu tháo rời được để đưa lên và lắp tại phòng. Hãy báo trước tầng và tình trạng thang máy khi đặt hàng.',
      },
      {
        q: 'Phòng giám đốc nên bố trí bàn theo hướng nào?',
        a: 'Về công năng, nên kê bàn sao cho người ngồi không quay lưng ra cửa, ánh sáng cửa sổ chiếu từ bên cạnh thay vì thẳng vào màn hình, và có khoảng trống phía sau đủ để lùi ghế. Các yếu tố phong thuỷ tuỳ theo quan niệm riêng của mỗi người.',
      },
    ],
  },

  'sofa-van-phong': {
    intro:
      '<p><strong>Sofa văn phòng</strong> đặt ở sảnh lễ tân, khu chờ hoặc phòng giám đốc, nên tiêu chí chọn khác sofa gia đình: chịu được tần suất ngồi xuống đứng lên liên tục, dễ lau chùi và giữ form sau thời gian dài.</p>' +
      '<p>Khách ngồi sofa văn phòng thường chỉ 5–20 phút, nên độ êm sâu không quan trọng bằng độ chắc của khung và mặt ngồi.</p>',
    sections: [
      {
        h2: 'Sofa cho khu vực nào thì chọn kiểu gì?',
        body:
          '<ul>' +
          '<li><strong>Sảnh lễ tân:</strong> ưu tiên sofa văng dài hoặc ghế băng, bọc da công nghiệp dễ lau, màu trung tính hợp nhận diện công ty.</li>' +
          '<li><strong>Phòng giám đốc:</strong> bộ 1+2 hoặc 1+1 kèm bàn trà nhỏ, tông màu đồng bộ ghế và bàn làm việc.</li>' +
          '<li><strong>Khu nghỉ nhân viên:</strong> sofa nỉ hoặc vải bố tạo cảm giác thân thiện hơn, nên chọn loại tháo vỏ giặt được.</li>' +
          '</ul>',
      },
      {
        h2: 'Đo trước khi mua để tránh sai kích thước',
        body:
          '<p>Đo chiều dài bức tường định kê và trừ ra ít nhất 20cm mỗi bên để sofa không chạm sát tường. Nếu kê kèm bàn trà, chừa 40–45cm giữa mép sofa và bàn để người ngồi duỗi chân.</p>' +
          '<p>Với sảnh có cửa kính, nên tránh vị trí nắng chiếu trực tiếp lên mặt da để hạn chế bạc màu. ' +
          WARRANTY_NOTE +
          '</p>',
      },
    ],
    faqs: [
      {
        q: 'Sofa văn phòng nên bọc da hay bọc nỉ?',
        a: 'Da công nghiệp dễ lau vết bẩn, phù hợp sảnh lễ tân và khu vực khách ra vào nhiều. Nỉ và vải bố mềm mại hơn, hợp khu nghỉ nhân viên nhưng dễ bám bụi, nên chọn loại có vỏ tháo giặt được.',
      },
      {
        q: 'Sofa có giao và kê tận nơi không?',
        a: 'Tại Hà Nội và TP.HCM, OFINA giao và kê đặt tại vị trí bạn chỉ định. Với sofa cỡ lớn, hãy báo trước về thang máy và lối vào để đội giao hàng chuẩn bị phương án.',
      },
      {
        q: 'Bộ sofa văn phòng thường gồm những gì?',
        a: 'Cấu hình phổ biến là 1 ghế dài kèm 1–2 ghế đơn, một số bộ có kèm bàn trà. Thành phần cụ thể ghi rõ trong trang sản phẩm; nếu cần tách lẻ hoặc ghép theo diện tích, bạn có thể liên hệ để được tư vấn.',
      },
      {
        q: 'Sofa văn phòng bảo hành bao lâu?',
        a: 'Khung gỗ và khung kim loại 24 tháng; phần đệm, da và nỉ 12 tháng, theo chính sách bảo hành chung của OFINA.',
      },
    ],
  },

  'ban-hop-lon': {
    intro:
      '<p><strong>Bàn họp lớn</strong> phục vụ phòng họp từ 12 chỗ trở lên — nơi diễn ra họp ban lãnh đạo, họp toàn phòng ban hoặc tiếp đối tác. Ở quy mô này, bài toán không còn là chọn một cái bàn mà là thiết kế cả không gian: đường điện, tầm nhìn tới màn hình trình chiếu, lối đi và cách vận chuyển bàn vào phòng.</p>' +
      '<p>OFINA có sẵn các mẫu bàn liền tấm và bàn ghép module cho phòng họp lớn, kèm tư vấn bố trí theo mặt bằng thực tế.</p>',
    sections: [
      {
        h2: 'Bàn liền tấm hay bàn ghép module?',
        body:
          '<ul>' +
          '<li><strong>Bàn liền tấm:</strong> mặt bàn liền mạch, nhìn sang và chắc chắn. Nhược điểm là khó vận chuyển — bàn dài trên 3m thường không qua được thang máy dân dụng, phải tính đường đi từ trước.</li>' +
          '<li><strong>Bàn ghép module:</strong> gồm nhiều phần lắp lại, dễ đưa vào phòng và có thể tách ra khi cần đổi bố cục hoặc chia phòng. Đường ghép nhìn kỹ vẫn thấy, nhưng đổi lại linh hoạt hơn hẳn.</li>' +
          '</ul>' +
          '<p>Nếu phòng họp của bạn cũng dùng để đào tạo hoặc tổ chức sự kiện nội bộ, module gần như luôn là lựa chọn đúng.</p><p>Trường hợp phòng họp lớn thường xuyên bị đặt kín chỉ để một vài người họp trực tuyến, cân nhắc thêm <a href="/danh-muc/cabin-cach-am-di-dong">cabin cách âm</a> làm phòng họp phụ — rẻ và nhanh hơn ngăn thêm phòng.</p>',
      },
      {
        h2: 'Ba thứ phải tính trước khi đặt bàn họp lớn',
        body:
          '<ul>' +
          '<li><strong>Đường điện:</strong> phòng 12–20 người cần nhiều ổ cắm hơn bạn nghĩ. Hộp điện âm bàn giúp tránh dây chạy ngang sàn — vốn vừa xấu vừa dễ vấp.</li>' +
          '<li><strong>Tầm nhìn màn hình:</strong> người ngồi hai đầu bàn dài thường bị lệch góc nhìn. Bàn hình thuyền hoặc bo góc cải thiện đáng kể so với bàn chữ nhật thẳng.</li>' +
          '<li><strong>Lối vận chuyển:</strong> đo cửa phòng, hành lang và thang máy trước khi chốt kích thước. Đây là lý do phổ biến nhất khiến đơn bàn lớn phải đổi mẫu giữa chừng.</li>' +
          '</ul>',
      },
    ],
    faqs: [
      {
        q: 'Phòng họp 30m² kê được bàn bao nhiêu chỗ?',
        a: 'Phòng khoảng 30m² thường phù hợp bàn 4m8 đến 5m, tương ứng 16–18 chỗ, vẫn đủ lối đi 1m quanh bàn. Nếu phòng có bục thuyết trình hoặc tủ tài liệu dọc tường, nên giảm một cỡ bàn để không bị chật.',
      },
      {
        q: 'Bàn họp lớn có đưa được lên tầng cao không?',
        a: 'Với bàn liền tấm dài, cần kiểm tra kích thước thang máy và hành lang trước. Nếu không đưa được nguyên tấm, phương án thay thế là bàn ghép module lắp tại phòng. Hãy báo trước tầng, tình trạng thang máy và lối vào khi đặt hàng để OFINA chuẩn bị phương án phù hợp.',
      },
      {
        q: 'Có làm được hộp điện âm bàn không?',
        a: 'Nhiều mẫu bàn họp lớn có sẵn vị trí lắp hộp điện hoặc lỗ luồn dây. Bạn nên nêu rõ nhu cầu về số ổ cắm và cổng mạng khi liên hệ để được tư vấn mẫu phù hợp ngay từ đầu, thay vì khoan bổ sung sau khi lắp.',
      },
      {
        q: 'Mua bàn họp lớn kèm ghế có được tư vấn trọn bộ không?',
        a: 'Có. OFINA nhận khảo sát mặt bằng và đề xuất phương án trọn bộ gồm bàn, ghế và số lượng phù hợp với diện tích phòng. Gửi yêu cầu qua trang báo giá B2B hoặc gọi hotline để được tính phương án.',
      },
    ],
  },

  'ban-training': {
    intro:
      '<p><strong>Bàn training</strong> (bàn đào tạo, bàn hội thảo) khác bàn làm việc ở một điểm cốt lõi: phòng đào tạo phải đổi bố cục thường xuyên — hôm nay xếp hàng ngang nghe giảng, mai ghép chữ U thảo luận, ngày kia dẹp gọn lấy chỗ.</p>' +
      '<p>Vì vậy tiêu chí số một là dễ di chuyển và ghép nối, không phải mặt bàn rộng.</p>',
    sections: [
      {
        h2: 'Bàn training nên có những gì?',
        body:
          '<ul>' +
          '<li><strong>Bánh xe có khoá:</strong> một người đẩy được bàn, khoá lại thì đứng yên khi viết. Đây là tính năng tạo khác biệt lớn nhất trong phòng đào tạo.</li>' +
          '<li><strong>Mặt bàn gập:</strong> gập dựng đứng để xếp chồng sát tường, giải phóng diện tích khi phòng dùng cho việc khác.</li>' +
          '<li><strong>Tấm chắn phía trước:</strong> giúp người ngồi kín đáo hơn khi bàn xếp thành hàng đối diện.</li>' +
          '<li><strong>Cạnh thẳng, góc vuông:</strong> để ghép nhiều bàn thành dãy dài hoặc chữ U mà không hở khe.</li>' +
          '</ul>',
      },
      {
        h2: 'Xếp bàn theo mục đích buổi học',
        body:
          '<ul>' +
          '<li><strong>Hàng ngang hướng bảng:</strong> hợp buổi giảng một chiều, sức chứa cao nhất trên cùng diện tích.</li>' +
          '<li><strong>Chữ U:</strong> mọi người nhìn thấy nhau, hợp buổi thảo luận và đào tạo kỹ năng dưới 20 người.</li>' +
          '<li><strong>Cụm đảo 4–6 người:</strong> hợp buổi làm bài nhóm, nhưng tốn diện tích hơn và cần lối đi giữa các cụm.</li>' +
          '</ul>' +
          '<p>Dù chọn kiểu nào, chừa tối thiểu 90cm giữa các hàng để người phía trong ra vào không phải kéo cả dãy bàn.</p>',
      },
    ],
    faqs: [
      {
        q: 'Bàn training có gập và xếp chồng được không?',
        a: 'Tuỳ mẫu. Loại mặt gập cho phép dựng đứng và xếp sát nhau để cất gọn; loại mặt cố định thì không. Nếu phòng của bạn dùng chung cho nhiều mục đích, hãy nói rõ nhu cầu này khi liên hệ để chọn đúng mẫu.',
      },
      {
        q: 'Một người ngồi cần bao nhiêu chiều dài bàn?',
        a: 'Khoảng 60cm cho buổi học chỉ ghi chép, và 70–75cm nếu học viên dùng laptop kèm tài liệu. Bàn training dài 1m2 thường xếp 2 chỗ, bàn 1m8 xếp 2–3 chỗ tuỳ cách bố trí.',
      },
      {
        q: 'Bàn training dùng làm bàn làm việc hàng ngày được không?',
        a: 'Được, nhưng mặt bàn training thường hẹp hơn bàn làm việc tiêu chuẩn nên phù hợp với công việc dùng laptop hơn là setup hai màn hình. Nếu cần bàn cho nhân viên ngồi cả ngày, bàn làm việc chuyên dụng sẽ thoải mái hơn.',
      },
      {
        q: 'Đặt số lượng lớn cho phòng đào tạo có hỗ trợ gì thêm?',
        a: 'OFINA nhận khảo sát phòng, đề xuất số lượng và sơ đồ xếp bàn theo diện tích, kèm báo giá theo số lượng cho doanh nghiệp qua trang báo giá B2B.',
      },
    ],
  },

  'ban-giam-doc-chan-sat': {
    intro:
      '<p><strong>Bàn giám đốc chân sắt</strong> là lựa chọn của những phòng làm việc theo hướng hiện đại, tối giản: khung sắt sơn tĩnh điện mảnh mà chắc, mặt gỗ công nghiệp phủ chống xước, tổng thể nhẹ nhõm hơn bàn khung gỗ bề thế truyền thống.</p>' +
      '<p>So với bàn lãnh đạo khung gỗ cùng kích thước, dòng chân sắt thường gọn hơn về thị giác và dễ phối với nội thất văn phòng chung của công ty.</p>',
    sections: [
      {
        h2: 'Khi nào nên chọn chân sắt thay vì chân gỗ?',
        body:
          '<ul>' +
          '<li><strong>Phòng diện tích vừa:</strong> chân sắt mảnh tạo cảm giác thoáng hơn, phòng không bị nặng nề.</li>' +
          '<li><strong>Văn phòng phong cách hiện đại:</strong> dễ đồng bộ với bàn nhân viên chân sắt để cả văn phòng nhìn cùng một ngôn ngữ thiết kế.</li>' +
          '<li><strong>Cần di chuyển, sắp xếp lại:</strong> khung sắt nhẹ hơn khối gỗ, tháo lắp nhanh hơn khi đổi bố cục.</li>' +
          '</ul>' +
          '<p>Ngược lại, nếu phòng giám đốc thiên hướng cổ điển hoặc cần cảm giác bề thế khi tiếp đối tác, bàn khung gỗ vẫn là lựa chọn hợp hơn.</p>',
      },
      {
        h2: 'Phối bàn chân sắt với phần còn lại của phòng',
        body:
          '<p>Chọn màu mặt bàn trước, rồi mới chọn tủ tài liệu và ghế theo nó. Mặt gỗ tông sáng hợp phòng nhỏ và ánh sáng yếu; tông walnut hoặc óc chó tạo chiều sâu cho phòng rộng.</p>' +
          '<p>Chân sắt thường có hai lựa chọn màu phổ biến là đen và trắng — chọn trùng tông với chân ghế và chân tủ sẽ gọn mắt hơn là để mỗi món một màu. ' +
          'Bảo hành theo chính sách OFINA: khung kim loại và khung gỗ 24 tháng.</p>',
      },
    ],
    faqs: [
      {
        q: 'Bàn giám đốc chân sắt có chắc chắn không?',
        a: 'Khung sắt hộp sơn tĩnh điện chịu tải tốt và ít cong vênh theo độ ẩm hơn gỗ. Điều nên kiểm tra là bàn có thanh giằng ngang không và chân có nút cân bằng không — hai chi tiết này quyết định bàn có rung khi gõ phím hay không.',
      },
      {
        q: 'Bàn có kèm hộc kéo hoặc tủ phụ không?',
        a: 'Tuỳ mẫu: một số cấu hình kèm hộc di động hoặc tủ phụ chữ L, một số chỉ có phần bàn. Thông tin cấu hình ghi trong trang từng sản phẩm; nếu cần xác nhận trước khi đặt, bạn có thể gọi hotline.',
      },
      {
        q: 'Kích thước nào phù hợp cho phòng giám đốc 15m²?',
        a: 'Phòng khoảng 15m² thường vừa với bàn 1m6–1m8 kèm một tủ thấp, vẫn còn chỗ cho 2 ghế tiếp khách. Bàn lớn hơn sẽ khiến lối đi quanh bàn chật.',
      },
      {
        q: 'Mặt bàn có chống xước không?',
        a: 'Mặt gỗ công nghiệp phủ melamine hoặc laminate có khả năng chống xước tốt trong sử dụng thường ngày. Vẫn nên dùng lót chuột và tránh kéo lê vật kim loại sắc trên mặt bàn.',
      },
    ],
  },

  'cum-ban-lam-viec-4-nguoi': {
    intro:
      '<p><strong>Cụm bàn làm việc 4 người</strong> là đơn vị bố trí phổ biến nhất trong văn phòng hiện nay: gom bốn chỗ ngồi vào một khối, dùng chung chân bàn và vách ngăn, tiết kiệm diện tích rõ rệt so với kê bốn bàn rời.</p>' +
      '<p>Cụm 4 người cũng là kích thước dễ nhân bản — văn phòng 16 người xếp 4 cụm, 24 người xếp 6 cụm, lối đi giữa các cụm vẫn thông thoáng.</p>',
    sections: [
      {
        h2: 'Cụm bàn tiết kiệm diện tích như thế nào?',
        body:
          '<p>Bốn bàn rời 1m2 kê riêng cần khoảng lùi ghế cho từng bàn, tổng diện tích chiếm thường lớn hơn 25–30% so với một cụm 4 người cùng kích thước mặt làm việc.</p>' +
          '<p>Cụm còn gom được đường dây điện và mạng vào một trục chung, thay vì mỗi bàn kéo một đường riêng ra ổ tường — vừa gọn vừa an toàn hơn.</p>',
      },
      {
        h2: 'Vách ngăn: nên cao bao nhiêu?',
        body:
          '<ul>' +
          '<li><strong>Vách thấp 30–40cm:</strong> chỉ phân định chỗ ngồi, giữ được không khí cởi mở, hợp đội nhóm trao đổi liên tục.</li>' +
          '<li><strong>Vách trung 50–60cm:</strong> che tầm nhìn khi ngồi nhưng vẫn thấy nhau khi đứng — mức cân bằng được dùng nhiều nhất.</li>' +
          '<li><strong>Vách cao trên 1m:</strong> tập trung tốt, phù hợp công việc cần yên tĩnh, nhưng khiến không gian bí và khó giao tiếp.</li>' +
          '</ul>' +
          '<p>Vách nỉ tiêu âm tốt hơn vách kính hoặc mica; vách kính sáng hơn nhưng không giảm ồn.</p><p>Lưu ý: vách ngăn chỉ giảm ồn phần nào, không tạo được sự riêng tư khi gọi điện. Văn phòng có nhiều cuộc gọi khách hàng hoặc họp trực tuyến thường bổ sung thêm <a href="/danh-muc/cabin-cach-am-di-dong">cabin cách âm di động</a> đặt cạnh khu làm việc.</p>',
      },
    ],
    faqs: [
      {
        q: 'Cụm bàn 4 người chiếm bao nhiêu diện tích?',
        a: 'Tuỳ kích thước từng chỗ ngồi, nhưng cụm 4 người phổ biến chiếm khoảng 4–6 m² cho phần bàn, cộng thêm khoảng lùi ghế mỗi phía. Khi tính phòng, nên dự trù 1m lối đi giữa các cụm.',
      },
      {
        q: 'Có thể mở rộng cụm khi tuyển thêm người không?',
        a: 'Nhiều mẫu cụm bàn thiết kế nối dài thêm module. Nếu bạn dự kiến tăng nhân sự, hãy nói rõ khi đặt để chọn mẫu có khả năng mở rộng, tránh trường hợp sau này phải mua cụm mới không khớp kiểu dáng.',
      },
      {
        q: 'Cụm bàn có sẵn hộp điện và lỗ luồn dây không?',
        a: 'Tuỳ mẫu. Một số cụm có máng đi dây dọc trục giữa và lỗ khoét trên mặt bàn, một số không. Đây là chi tiết nên hỏi rõ trước khi đặt vì bổ sung sau sẽ khó gọn.',
      },
      {
        q: 'Lắp đặt cụm bàn mất bao lâu?',
        a: 'Tại Hà Nội và TP.HCM, OFINA giao và lắp đặt tận nơi; một cụm 4 người thường lắp trong khoảng một giờ. Với đơn nhiều cụm, đội ngũ sẽ hẹn lịch để lắp gọn trong ngày, hạn chế ảnh hưởng công việc của văn phòng.',
      },
    ],
  },

  'ghe-cafe-chan-co-dinh': {
    intro:
      '<p><strong>Ghế cafe chân cố định</strong> dùng cho quán cà phê, trà sữa, khu pantry công ty và không gian ăn uống. Khác ghế văn phòng, ghế cafe không cần điều chỉnh độ cao hay xoay — đổi lại phải chịu được tần suất ngồi xuống đứng lên rất cao và dễ xếp dọn cuối ngày.</p>' +
      '<p>Danh mục này gồm nhiều kiểu dáng và chất liệu để phối theo phong cách quán, từ mẫu gỗ mộc đến khung sắt tối giản.</p>',
    sections: [
      {
        h2: 'Chọn ghế cafe theo loại quán',
        body:
          '<ul>' +
          '<li><strong>Quán lượt khách nhanh:</strong> ưu tiên ghế nhẹ, xếp chồng được, mặt ngồi dễ lau — khách ngồi ngắn nên độ êm không quan trọng bằng độ bền.</li>' +
          '<li><strong>Quán khách ngồi lâu, làm việc:</strong> chọn ghế có tựa lưng cong ôm và mặt ngồi rộng hơn, tránh ghế đẩu không tựa.</li>' +
          '<li><strong>Khu pantry công ty:</strong> ghế dễ vệ sinh và chịu được va chạm hàng ngày quan trọng hơn thẩm mỹ cầu kỳ.</li>' +
          '</ul>',
      },
      {
        h2: 'Chiều cao ghế phải khớp chiều cao bàn',
        body:
          '<p>Khoảng cách hợp lý giữa mặt ngồi và mặt bàn là 27–30cm. Bàn cafe cao khoảng 72–75cm đi với ghế mặt ngồi 43–45cm; bàn bar cao 100–110cm cần ghế bar 65–75cm.</p>' +
          '<p>Đây là lỗi hay gặp nhất khi mua lẻ từng món: ghế đẹp, bàn đẹp, nhưng ngồi vào thì mặt bàn quá cao so với tay. Nếu mua cả bộ, hãy kiểm tra hai con số này trước.</p>',
      },
    ],
    faqs: [
      {
        q: 'Ghế cafe chân cố định có xếp chồng được không?',
        a: 'Một số mẫu thiết kế xếp chồng để cất gọn khi dọn quán hoặc khi cần trống mặt bằng; nhiều mẫu có tựa lưng tạo dáng thì không xếp được. Nếu quán cần dọn dẹp mỗi tối, hãy nêu nhu cầu này khi chọn mẫu.',
      },
      {
        q: 'Ghế dùng ngoài trời được không?',
        a: 'Ghế khung sắt sơn tĩnh điện và mặt nhựa chịu được hiên có mái che, nhưng để mưa nắng trực tiếp lâu ngày sẽ bong sơn và han gỉ. Với khu vực ngoài trời hoàn toàn, nên chọn chất liệu chuyên dụng và hỏi rõ trước khi đặt.',
      },
      {
        q: 'Mua số lượng lớn cho quán có chính sách riêng không?',
        a: 'Có. OFINA nhận báo giá theo số lượng cho quán và doanh nghiệp. Bạn có thể gửi số lượng và mẫu quan tâm qua trang báo giá B2B để được tính phương án.',
      },
      {
        q: 'Ghế cafe bảo hành thế nào?',
        a: 'Khung kim loại và khung gỗ bảo hành 24 tháng; phần đệm và bọc 12 tháng, theo chính sách bảo hành chung của OFINA. Không áp dụng cho hư hỏng do va đập hoặc sử dụng sai mục đích.',
      },
    ],
  },

  'ban-cafe-chan-sat-mat-go-kinh-abs': {
    intro:
      '<p><strong>Bàn cafe chân sắt</strong> với mặt gỗ, kính hoặc ABS là dòng bàn được dùng nhiều nhất ở quán cà phê, trà sữa và khu vực tiếp khách: chân sắt gọn, chịu lực tốt, mặt bàn có nhiều lựa chọn chất liệu để hợp phong cách và ngân sách.</p>' +
      '<p>Chọn đúng mặt bàn quan trọng hơn chọn kiểu chân, vì mặt bàn là thứ chịu đựng vết nước, nhiệt từ cốc nóng và việc lau chùi hàng chục lần mỗi ngày.</p>',
    sections: [
      {
        h2: 'Mặt gỗ, mặt kính hay mặt ABS?',
        body:
          '<ul>' +
          '<li><strong>Mặt gỗ công nghiệp:</strong> ấm, hợp quán phong cách mộc. Cần lau khô ngay khi đổ nước vì mép bàn là chỗ dễ ngấm nhất.</li>' +
          '<li><strong>Mặt kính cường lực:</strong> sang và cực dễ lau, nhưng hiện rõ dấu vân tay và vết nước, nên quán đông khách phải lau liên tục.</li>' +
          '<li><strong>Mặt ABS hoặc nhựa nén:</strong> chịu nước và chịu va đập tốt nhất, nhẹ, phù hợp quán lượt khách cao hoặc khu vực ngoài hiên có mái che.</li>' +
          '</ul>',
      },
      {
        h2: 'Kích thước và số chỗ ngồi',
        body:
          '<ul>' +
          '<li><strong>Bàn tròn 60cm hoặc vuông 60×60:</strong> 2 chỗ, phù hợp quán nhỏ cần tối đa số bàn.</li>' +
          '<li><strong>Bàn 70×70 đến 80×80:</strong> 2–4 chỗ, cỡ linh hoạt nhất cho quán cà phê.</li>' +
          '<li><strong>Bàn chữ nhật 120×60:</strong> 4 chỗ, hợp nhóm khách hoặc khách ngồi làm việc với laptop.</li>' +
          '</ul>' +
          '<p>Chừa lối đi tối thiểu 90cm giữa các dãy bàn để nhân viên bưng bê không phải lách qua lưng khách.</p>',
      },
    ],
    faqs: [
      {
        q: 'Mặt bàn nào bền nhất cho quán đông khách?',
        a: 'Mặt ABS hoặc nhựa nén chịu nước, chịu va đập và ít để lại vết nhất, nên phù hợp quán có lượt khách cao. Mặt kính dễ lau nhưng lộ vết; mặt gỗ đẹp nhưng cần xử lý vết nước nhanh, đặc biệt ở phần mép.',
      },
      {
        q: 'Chân bàn có bị lung lay trên sàn gạch không?',
        a: 'Mẫu có đế tròn hoặc đế chữ thập rộng và nút cân bằng dưới chân sẽ đứng vững kể cả khi sàn hơi lệch. Nếu sàn quán không phẳng, nên ưu tiên mẫu có nút chỉnh cao thấp từng chân.',
      },
      {
        q: 'Bàn cafe có dùng cho khu pantry văn phòng được không?',
        a: 'Được, và là lựa chọn phổ biến vì dễ lau và không chiếm nhiều diện tích. Với pantry, mặt ABS hoặc laminate thường thực tế hơn mặt kính.',
      },
      {
        q: 'Đặt nhiều bàn cho quán có được tư vấn bố trí không?',
        a: 'Có. Bạn gửi diện tích và sơ đồ mặt bằng qua trang báo giá B2B hoặc hotline, OFINA sẽ đề xuất số lượng bàn, kích thước và cách xếp để tối ưu số chỗ ngồi mà vẫn giữ lối đi hợp lý.',
      },
    ],
  },

  'cabin-cach-am-di-dong': {
    intro:
      '<p><strong>Cabin cách âm di động</strong> (phone booth, acoustic pod) là buồng làm việc khép kín đặt ngay trong văn phòng, dùng cho việc cần yên tĩnh: gọi điện quan trọng, họp trực tuyến, phỏng vấn, hoặc đơn giản là tập trung làm việc giữa không gian mở ồn ào.</p>' +
      '<p>Điểm khác biệt so với xây phòng kín: cabin lắp trong vài giờ, không đụng tới kết cấu toà nhà, và <strong>tháo ra mang đi được khi công ty chuyển văn phòng</strong> — thứ mà một bức tường xây không làm được. OFINA có 11 mẫu Silence Booth từ cỡ S đến XL.</p>',
    sections: [
      {
        h2: 'Hiểu đúng con số cách âm trước khi so sánh giá',
        body:
          '<p>Có một tiêu chuẩn quốc tế dành riêng cho buồng cách âm văn phòng: <strong>ISO 23351-1:2020</strong>. Tiêu chuẩn này không đo “cách âm” chung chung mà đo đúng thứ người mua quan tâm — <strong>mức giảm tiếng nói</strong> (ký hiệu DS,A): tiếng người nói bên trong lọt ra ngoài còn bao nhiêu. Kết quả được xếp hạng:</p>' +
          '<table>' +
          '<tr><th>Hạng</th><th>Mức giảm tiếng nói</th><th>Ý nghĩa thực tế</th></tr>' +
          '<tr><td><strong>A</strong></td><td>trên 30 dB</td><td>Riêng tư gần như tuyệt đối, kể cả trong văn phòng yên tĩnh</td></tr>' +
          '<tr><td><strong>B</strong></td><td>25–30 dB</td><td>Đủ riêng tư cho hầu hết văn phòng — mức được xem là cân bằng nhất giữa hiệu quả và chi phí</td></tr>' +
          '<tr><td><strong>C</strong></td><td>20–25 dB</td><td>Chỉ đủ khi văn phòng vốn đã ồn; phòng yên thì bên ngoài vẫn nghe loáng thoáng</td></tr>' +
          '<tr><td><strong>D</strong></td><td>15–20 dB</td><td>Giảm ồn là chính, không đảm bảo riêng tư</td></tr>' +
          '</table>' +
          '<p>Mốc cần nhớ: <strong>khoảng 25 dB là ngưỡng tối thiểu để có riêng tư lời nói</strong> trong một văn phòng bình thường. Dưới mức đó, cabin chỉ giúp bớt ồn chứ không giúp giữ kín nội dung cuộc gọi.</p>' +
          '<p><strong>Một lưu ý dễ bị đánh lừa:</strong> nhiều bảng thông số ghi con số cách âm rất cao (35–40 dB) nhưng đó là mức cách âm chung đo trong phòng thí nghiệm, không phải mức giảm tiếng nói DS,A theo ISO 23351-1. Hai con số khác nhau. Khi so sánh sản phẩm, hãy hỏi thẳng: <em>“Cabin này đạt hạng mấy theo ISO 23351-1, và có chứng nhận đo không?”</em> — câu hỏi đó lọc được rất nhanh giữa hàng có kiểm định và hàng chỉ nói miệng.</p>' +
          '<p>Mức cách âm đến từ cấu tạo vách chứ không phải từ giá. Vách một lớp ván tiêu âm cho kết quả thấp; vách nhiều lớp (khung thép, bông tiêu âm, ván tiêu âm, tấm sợi polyester) mới đạt hạng cao. Vì vậy khi hỏi giá, hãy hỏi luôn <strong>vách gồm mấy lớp và vật liệu từng lớp</strong>.</p>' +
          '<p>Lưu ý cuối: cách âm là <strong>hai chiều</strong>. Người bên ngoài cũng không nghe được nội dung bên trong — đây mới là lý do bộ phận nhân sự, pháp chế và ban giám đốc cần cabin thay vì chỉ một góc yên tĩnh.</p>',
      },
      {
        h2: 'Chọn kích cỡ theo cách dùng thực tế',
        body:
          '<p>Dòng Silence Booth ký hiệu cỡ ngay trong mã sản phẩm — S, M, SL, L, XL. Cách chọn theo nhu cầu:</p>' +
          '<ul>' +
          '<li><strong>Cỡ S:</strong> một người đứng hoặc ngồi ghế nhỏ, dùng cho cuộc gọi ngắn. Chiếm ít diện tích nhất, hợp văn phòng chật.</li>' +
          '<li><strong>Cỡ M:</strong> một người ngồi làm việc thoải mái với laptop, hoặc hai người trao đổi nhanh.</li>' +
          '<li><strong>Cỡ L và XL:</strong> họp nhóm nhỏ 3–6 người, phỏng vấn có hội đồng, hoặc làm phòng họp phụ khi phòng họp chính kín lịch.</li>' +
          '</ul>' +
          '<p>Kinh nghiệm bố trí: đừng chọn cỡ lớn nhất nếu 90% nhu cầu là gọi điện một mình. Hai cabin cỡ S phục vụ được nhiều lượt hơn một cabin cỡ L với cùng ngân sách và diện tích.</p>',
      },
      {
        h2: 'Bảy câu phải hỏi trước khi đặt cabin',
        body:
          '<p>Vì đây là khoản đầu tư lớn và dùng nhiều năm, nên hỏi kỹ những điểm sau với bất kỳ nhà cung cấp nào:</p>' +
          '<ul>' +
          '<li><strong>Thông gió:</strong> cabin có quạt hút và cấp khí không, ồn bao nhiêu, thay khí mấy lần mỗi giờ? Cabin kín mà thông gió kém sẽ bí sau 15 phút — lỗi khiến nhiều cabin bị bỏ không.</li>' +
          '<li><strong>Điện và mạng:</strong> có sẵn ổ cắm, cổng USB, đèn chưa? Nguồn điện lấy từ đâu và đi dây thế nào?</li>' +
          '<li><strong>Kính và cửa:</strong> kính cường lực dày bao nhiêu, cửa đóng có kín khít không? Khe cửa là chỗ rò âm nhiều nhất.</li>' +
          '<li><strong>Sàn và chống rung:</strong> cabin đặt trực tiếp lên sàn hay có đệm chống rung? Thiếu lớp này thì tiếng bước chân vẫn truyền vào.</li>' +
          '<li><strong>Lắp đặt:</strong> mất bao lâu, cần bao nhiêu người, có phải khoan vào sàn hoặc trần không?</li>' +
          '<li><strong>Di chuyển về sau:</strong> tháo lắp lại được mấy lần, chi phí di dời khi chuyển văn phòng?</li>' +
          '<li><strong>Bảo hành và linh kiện:</strong> quạt và đèn là bộ phận hao mòn — có sẵn linh kiện thay thế không?</li>' +
          '</ul>' +
          '<p>Thông số chi tiết của từng mẫu Silence Booth được ghi trong trang sản phẩm tương ứng. Nếu cần bản thông số đầy đủ để so sánh hoặc trình duyệt ngân sách, liên hệ OFINA để nhận hồ sơ kỹ thuật của mẫu bạn quan tâm.</p>',
      },
      {
        h2: 'Cabin hay xây phòng kín: cái nào hợp hơn?',
        body:
          '<table>' +
          '<tr><th>Tiêu chí</th><th>Cabin cách âm</th><th>Xây phòng kín</th></tr>' +
          '<tr><td>Thời gian có phòng dùng</td><td>Vài giờ lắp đặt</td><td>Nhiều ngày đến vài tuần thi công</td></tr>' +
          '<tr><td>Ảnh hưởng công việc</td><td>Gần như không</td><td>Bụi, tiếng ồn, phải che chắn khu vực</td></tr>' +
          '<tr><td>Khi chuyển văn phòng</td><td>Tháo mang theo</td><td>Bỏ lại toàn bộ</td></tr>' +
          '<tr><td>Giấy phép, kết cấu</td><td>Không đụng kết cấu</td><td>Thường cần xin phép ban quản lý toà nhà</td></tr>' +
          '<tr><td>Thay đổi bố trí sau này</td><td>Di dời được</td><td>Cố định</td></tr>' +
          '</table>' +
          '<p>Với văn phòng thuê — chiếm phần lớn doanh nghiệp tại Hà Nội và TP.HCM — khả năng mang theo khi hết hạn hợp đồng thuê thường là yếu tố quyết định.</p>',
      },
    ],
    faqs: [
      {
        q: 'Cabin cách âm di động giá bao nhiêu?',
        a: 'Giá phụ thuộc kích cỡ và mức cách âm. Dải sản phẩm Silence Booth tại OFINA hiện từ khoảng 89 triệu cho mẫu cỡ S đến trên 230 triệu cho mẫu cỡ XL. Giá từng mẫu hiển thị trực tiếp trên trang sản phẩm; với đơn nhiều cabin, liên hệ để nhận báo giá theo số lượng.',
      },
      {
        q: 'Lắp cabin có phải khoan đục hay xin phép toà nhà không?',
        a: 'Cabin được lắp ghép tại chỗ và đặt trên sàn, không can thiệp kết cấu nên thường không cần xin phép cải tạo. Tuy nhiên bạn vẫn nên báo ban quản lý toà nhà về việc vận chuyển thiết bị lớn và tải trọng sàn tại vị trí đặt.',
      },
      {
        q: 'Bên trong cabin có bí không khi ngồi lâu?',
        a: 'Phụ thuộc hoàn toàn vào hệ thống thông gió. Cabin tốt có quạt cấp và hút khí hoạt động êm, giúp ngồi 30–60 phút vẫn thoải mái. Đây là câu nên hỏi kỹ trước khi mua, vì cabin thông gió kém thường bị nhân viên bỏ không sau vài tuần.',
      },
      {
        q: 'Cabin có chuyển được sang văn phòng mới không?',
        a: 'Có — đây là ưu điểm lớn nhất so với xây phòng kín. Cabin tháo rời và lắp lại tại địa điểm mới. Nên hỏi trước về quy trình và chi phí di dời để chủ động khi hết hạn hợp đồng thuê văn phòng.',
      },
      {
        q: 'Một văn phòng nên có bao nhiêu cabin?',
        a: 'Tham khảo phổ biến là một cabin cho mỗi 15–25 nhân sự làm việc trong không gian mở, tuỳ đặc thù công việc. Công ty có nhiều cuộc gọi khách hàng hoặc họp trực tuyến sẽ cần tỉ lệ cao hơn. Nếu gửi sơ đồ mặt bằng và số nhân sự, OFINA có thể đề xuất số lượng và vị trí đặt.',
      },
      {
        q: 'Thời gian giao và lắp đặt mất bao lâu?',
        a: 'Với mẫu có sẵn, thời gian giao trong nội thành Hà Nội và TP.HCM thường tính bằng ngày; việc lắp đặt tại chỗ thường hoàn tất trong vài giờ. Hãy xác nhận tình trạng hàng và lịch lắp cụ thể khi đặt, đặc biệt nếu bạn cần cabin cho một mốc thời gian cố định.',
      },
    ],
  },
}

export function getCategoryContent(slug: string): CategoryContent | null {
  return CATEGORY_CONTENT[slug] || null
}
