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
}

export function getCategoryContent(slug: string): CategoryContent | null {
  return CATEGORY_CONTENT[slug] || null
}
