import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface LessonPlanRequest {
  ageGroup: string;
  theme: string;
  developmentArea: string;
  activityType: string;
  integrationLevel: string;
  activityName: string;
  duration: string;
  objectives?: string;
}

export const generateLessonPlan = async (data: LessonPlanRequest) => {
  const model = "gemini-3.1-pro-preview";
  
  const prompt = `Bạn là một chuyên gia giáo dục mầm non tại Việt Nam. Hãy soạn một giáo án chi tiết dựa trên các thông tin sau:
- Độ tuổi: ${data.ageGroup}
- Chủ đề: ${data.theme}
- Lĩnh vực phát triển: ${data.developmentArea}
- Loại hoạt động: ${data.activityType}
- Mức độ tích hợp: ${data.integrationLevel}
- Tên hoạt động: ${data.activityName}
- Thời lượng: ${data.duration}
- Mục tiêu mong muốn: ${data.objectives || "Tự đề xuất phù hợp độ tuổi"}

YÊU CẦU CẤU TRÚC GIÁO ÁN (Bằng tiếng Việt, ngôn ngữ sư phạm chuẩn mầm non):

I. MỤC TIÊU
1. Kiến thức: ...
2. Kỹ năng: ...
3. Thái độ: ...
4. Năng lực hình thành: (tư duy, sáng tạo, hợp tác, giải quyết vấn đề)

II. CHUẨN BỊ
1. Đồ dùng của giáo viên: ...
2. Đồ dùng của trẻ: ...
3. Công cụ công nghệ/AI sử dụng: (Nếu có tích hợp AI)

III. TIẾN TRÌNH HOẠT ĐỘNG
1. Ổn định – Gây hứng thú: ...
2. Khám phá – Trải nghiệm: ...
3. Hoạt động trọng tâm: 
   - Yêu cầu viết kịch bản lời thoại chi tiết, sinh động giữa cô và trẻ.
   - Sử dụng các câu hỏi gợi mở (Tại sao? Như thế nào? Nếu... thì sao?).
   - Trình bày rõ ràng: 
     + Cô: [Lời thoại/Câu hỏi]
     + Trẻ: [Dự kiến phản hồi/Hành động của trẻ]
   - Thể hiện sự tương tác hai chiều, khuyến khích trẻ tự tin phát biểu và khám phá.
4. Thực hành – Sáng tạo: ...
5. Trò chơi củng cố: ...
6. Kết thúc – Nhận xét – Chuyển hoạt động: ...

${data.integrationLevel.includes("STEAM") ? `IV. MỤC TÍCH HỢP STEAM
Phân tích rõ 5 yếu tố:
- S (Science): ...
- T (Technology): ...
- E (Engineering): ...
- A (Art): ...
- M (Math): ...
Mô tả cụ thể cách tổ chức phù hợp độ tuổi ${data.ageGroup}.` : ""}

${data.integrationLevel.includes("AI") ? `V. ỨNG DỤNG AI TRONG HOẠT ĐỘNG
Đề xuất:
- Cách sử dụng AI tạo: Hình ảnh minh họa, Video hoạt hình, Giọng đọc trẻ em, Trò chơi tương tác.
- Cách giáo viên hướng dẫn trẻ tiếp cận AI an toàn.
- Đảm bảo phù hợp nhận thức trẻ mầm non, không lạm dụng màn hình.` : ""}

${data.integrationLevel === "traffic_safety" ? `IV. TÍCH HỢP GIÁO DỤC AN TOÀN GIAO THÔNG
- Các quy tắc giao thông cơ bản phù hợp độ tuổi.
- Tình huống giả định và cách xử lý.
- Giáo dục ý thức chấp hành luật lệ từ nhỏ.` : ""}

${data.integrationLevel === "abuse_prevention" ? `IV. TÍCH HỢP PHÒNG CHỐNG XÂM HẠI
- Giáo dục về các vùng riêng tư trên cơ thể.
- Quy tắc "Năm ngón tay" hoặc các quy tắc an toàn tương đương.
- Kỹ năng nói "Không", bỏ chạy và kể lại cho người lớn tin cậy.` : ""}

${data.integrationLevel === "sel" ? `IV. TÍCH HỢP GIÁO DỤC CẢM XÚC XÃ HỘI (SEL)
- Nhận biết và gọi tên cảm xúc.
- Kỹ năng làm chủ cảm xúc và giải quyết xung đột.
- Xây dựng mối quan hệ tích cực với bạn bè và cô giáo.` : ""}

${data.integrationLevel === "children_rights" ? `IV. TÍCH HỢP GIÁO DỤC QUYỀN TRẺ EM
- Giới thiệu các quyền cơ bản (được học tập, vui chơi, chăm sóc, bảo vệ).
- Giáo dục trẻ biết tôn trọng bản thân và người khác.
- Lồng ghép qua các câu chuyện, tình huống thực tế.` : ""}

${data.integrationLevel === "vietnamese_enhancement" ? `IV. TÍCH HỢP TĂNG CƯỜNG TIẾNG VIỆT
- Phát triển vốn từ vựng theo chủ đề.
- Rèn luyện kỹ năng nghe hiểu và phát âm chuẩn.
- Khuyến khích trẻ diễn đạt câu trọn vẹn, tự tin giao tiếp.` : ""}

${data.integrationLevel === "elm" ? `IV. ỨNG DỤNG BỘ CÔNG CỤ ELM (Early Learning Matters)
- Áp dụng các chiến lược thúc đẩy sự phát triển toàn diện.
- Cách quan sát và đánh giá trẻ theo tiêu chuẩn ELM.
- Các hoạt động tương tác gợi mở theo phương pháp ELM.` : ""}

${data.integrationLevel === "physical_dev" ? `IV. TÍCH HỢP GIÁO DỤC PHÁT TRIỂN THỂ CHẤT
- Các bài tập vận động thô và vận động tinh lồng ghép.
- Giáo dục dinh dưỡng và sức khỏe.
- Rèn luyện thói quen vệ sinh và tự phục vụ.` : ""}

VI. MỞ RỘNG – HOẠT ĐỘNG GÓC
- Gợi ý hoạt động liên kết: ...
- Trải nghiệm thực tế: ...
- Phối hợp phụ huynh: ...

VII. ĐÁNH GIÁ – ĐIỀU CHỈNH
- Tiêu chí quan sát: ...
- Biểu hiện đạt/chưa đạt: ...
- Hướng điều chỉnh: ...

Lưu ý: Nội dung phải phù hợp tâm sinh lý độ tuổi ${data.ageGroup}, khuyến khích trẻ trải nghiệm, thao tác, hợp tác.`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
};

export const generateAdvancedFeature = async (type: string, lessonPlan: string) => {
  const model = "gemini-3.1-pro-preview";
  
  let prompt = "";
  switch (type) {
    case "teaching_script":
      prompt = `Dựa trên giáo án sau, hãy viết một kịch bản dạy nhanh (Quick teaching script) tóm tắt các bước chính và lời thoại then chốt để giáo viên dễ dàng nắm bắt:\n\n${lessonPlan}`;
      break;
    case "video_script":
      prompt = `Chuyển giáo án sau thành một kịch bản video AI (phân cảnh, lời thoại, mô tả hình ảnh) để tạo video bài giảng:\n\n${lessonPlan}`;
      break;
    case "worksheet":
      prompt = `Dựa trên giáo án này, hãy thiết kế nội dung cho 2-3 phiếu học tập (Worksheet) sáng tạo cho trẻ:\n\n${lessonPlan}`;
      break;
    case "ppt_game":
      prompt = `Đề xuất ý tưởng và cấu trúc cho một trò chơi PowerPoint tự động (các slide, câu hỏi, hiệu ứng) phù hợp với giáo án này:\n\n${lessonPlan}`;
      break;
    case "image_prompts":
      prompt = `Tạo 5-7 prompt chi tiết (bằng tiếng Anh) để sinh hình ảnh minh họa cho các phần trong giáo án này bằng AI (như Midjourney/DALL-E):\n\n${lessonPlan}`;
      break;
  }

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  return response.text;
};
