
using Lasmark.Persistence.Entitys;
using Microsoft.EntityFrameworkCore;

namespace Lasmark.Persistence;

public class CircleRepository : ICircleRepository
{
    private readonly Context _context;
    public CircleRepository()
    {
        _context = new Context();
    }
    public async Task CreateCircleAsync(CircleEntity circle)
    {
        await _context.Circles.AddAsync(circle);
        await _context.SaveChangesAsync();
    }

    public async Task<List<CircleEntity>> GetCirclesAsync()
    {
        var result = await _context.Circles.Include(c => c.Comments).ToListAsync();
        return result;
    }

    public async Task AddCommentAsync(CommentEntity comment)
    {
        var result = await _context.Circles.FirstOrDefaultAsync(f => f.Id == comment.CircleId);
        if(result != null)
        {
            comment.Circles = result;
            await _context.Comments.AddAsync(comment);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteCercleAsync(int id)
    {
        var result = await _context.Circles.Include(o => o.Comments).FirstOrDefaultAsync(f => f.Id == id);
        if(result != null)
        {
            _context.Circles.Remove(result);
            await _context.SaveChangesAsync();
        }
    }
}
