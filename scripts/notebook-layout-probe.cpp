// Run through check-notebook-layout.mjs, using the Yoga shipped with React Native.
#include <yoga/Yoga.h>
#include <cmath>
#include <cstdlib>
#include <iostream>

int main(int argc, char** argv) {
  if (argc != 10) return 2;
  const float available = std::atof(argv[1]);
  const int count = std::atoi(argv[2]);
  const float gap = std::atof(argv[3]);
  auto root = YGNodeNew();
  YGNodeStyleSetWidth(root, available);
  YGNodeStyleSetFlexDirection(root, YGFlexDirectionRow);
  YGNodeStyleSetFlexWrap(root, YGWrapWrap);
  YGNodeStyleSetGap(root, YGGutterAll, gap);
  using Setter = void (*)(YGNodeRef, float);
  const Setter setters[] = {YGNodeStyleSetWidth, YGNodeStyleSetFlex,
    YGNodeStyleSetFlexGrow, YGNodeStyleSetFlexShrink, YGNodeStyleSetFlexBasis,
    YGNodeStyleSetMinWidth};
  for (int i = 0; i < count; ++i) {
    auto card = YGNodeNew();
    for (int p = 0; p < 6; ++p) {
      const float value = std::strtof(argv[p + 4], nullptr);
      if (!std::isnan(value)) setters[p](card, value);
    }
    // Content height does not affect the horizontal flex-basis regression.
    YGNodeStyleSetHeight(card, 250);
    YGNodeInsertChild(root, card, i);
  }
  YGNodeCalculateLayout(root, available, YGUndefined, YGDirectionLTR);
  std::cout << "[";
  for (int i = 0; i < count; ++i) {
    auto card = YGNodeGetChild(root, i);
    if (i) std::cout << ",";
    std::cout << "{\"width\":" << YGNodeLayoutGetWidth(card)
      << ",\"left\":" << YGNodeLayoutGetLeft(card)
      << ",\"top\":" << YGNodeLayoutGetTop(card) << "}";
  }
  std::cout << "]\n";
  YGNodeFreeRecursive(root);
}
